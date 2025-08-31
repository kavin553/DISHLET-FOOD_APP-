import React, { useState } from "react";
import { InvokeLLM, GenerateImage } from "@/integrations/Core";
import { Recipe } from "@/entities/Recipe";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Clock, Users, ChefHat, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RecipeCard from "../components/RecipeCard";
import IngredientInput from "../components/IngredientInput";
import NotificationsBanner from "../components/NotificationsBanner";
import { differenceInCalendarDays, format } from "date-fns";

export default function RecipeGenerator() {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [preference, setPreference] = useState("veg");
  const [language, setLanguage] = useState("en");

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        // User not logged in
      }
    };
    loadUser();
  }, []);

  const withImages = async (list, ing, pref) => {
    const results = await Promise.all(list.map(async (r) => {
      const prompt = `High-quality, vibrant, realistic food photo of ${r.name}, ${pref.replace('_',' ')} style, appetizing plating, soft natural light, top-down angle, colorful ingredients (${ing}).`;
      const { url } = await GenerateImage({ prompt });
      return { ...r, image_url: url, preference: pref };
    }));
    return results;
  };

  const translateInstructions = async (list, lang) => {
    if (lang === "en") return list.map(r => ({ ...r, instructions_language: "en" }));
    const label = {
      en: "English", es: "Spanish", fr: "French", de: "German", it: "Italian", hi: "Hindi"
    }[lang] || "English";
    const translated = await Promise.all(list.map(async (r) => {
      const res = await InvokeLLM({
        prompt: `Translate the following cooking instructions into ${label}. Keep the step-by-step structure and clarity. Return only the translated steps array.\n${JSON.stringify(r.instructions)}`,
        response_json_schema: {
          type: "object",
          properties: {
            instructions: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["instructions"]
        }
      });
      return { ...r, instructions: res.instructions, instructions_language: lang };
    }));
    return translated;
  };

  const callLLM = async (ing, pref, surprise = false) => {
    const basePrompt = surprise
      ? `Create three surprising, creative yet practical recipes using: ${ing || 'any common pantry items'}.`
      : `Create three practical recipes using these ingredients: ${ing}.`;
    const response = await InvokeLLM({
      prompt: `${basePrompt}
Important: Provide the instructions in English by default.
Include for each: name, ingredients (concise comma-separated), step-by-step instructions (array), cooking_time, difficulty (Easy/Medium/Hard), cuisine, servings (number).
Adapt strictly to this preference: ${pref} (veg, non_veg, vegan, healthy).`,
      response_json_schema: {
        type: "object",
        properties: {
          recipes: {
            type: "array",
            minItems: 2,
            maxItems: 3,
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                ingredients: { type: "string" },
                instructions: { type: "array", items: { type: "string" } },
                cooking_time: { type: "string" },
                difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
                cuisine: { type: "string" },
                servings: { type: "number" }
              },
              required: ["name", "ingredients", "instructions"]
            }
          }
        },
        required: ["recipes"]
      }
    });
    return response.recipes;
  };

  const updateStreakAndBadges = async (pref, ingText) => {
    const me = await User.me();
    const today = new Date();
    const last = me.last_cooked_date ? new Date(me.last_cooked_date) : null;
    let streak = me.streak_count || 0;
    if (!last) {
      streak = 1;
    } else {
      const diff = differenceInCalendarDays(today, last);
      if (diff === 0) {
        streak = me.streak_count || 1;
      } else if (diff === 1) {
        streak = (me.streak_count || 0) + 1;
      } else if (diff > 1) {
        streak = 1;
      }
    }
    const badges = new Set(me.badges || []);
    if (streak >= 1) badges.add("Quick Chef");
    if (pref === "healthy") badges.add("Healthy Eater");
    if (/(chili|chilli|spice|spicy|pepper)/i.test(ingText)) badges.add("Spice Master");
    await User.updateMyUserData({
      last_cooked_date: format(today, "yyyy-MM-dd"),
      streak_count: streak,
      badges: Array.from(badges)
    });
  };

  const generateRecipe = async () => {
    if (!ingredients.trim()) return;
    setIsGenerating(true);
    setRecipe(null);
    setRecipes([]);
    const llmRecipes = await callLLM(ingredients, preference, false);
    const withImgs = await withImages(llmRecipes, ingredients, preference);
    const localized = await translateInstructions(withImgs, language);
    setRecipes(localized);
    setIsGenerating(false);
  };

  const surpriseMe = async () => {
    setIsGenerating(true);
    setRecipe(null);
    setRecipes([]);
    const llmRecipes = await callLLM(ingredients, preference, true);
    const withImgs = await withImages(llmRecipes, ingredients || "pantry items", preference);
    const localized = await translateInstructions(withImgs, language);
    setRecipes(localized);
    setIsGenerating(false);
  };

  const saveRecipe = async (r) => {
    if (!r || !user) return;
    setIsSaving(true);
    await Recipe.create({
      ...r,
      preference,
      rating: r.rating || 0,
      instructions_language: r.instructions_language || language,
      created_by: user.email
    });
    await updateStreakAndBadges(preference, ingredients);
    setIsSaving(false);
  };

  const rateRecipe = (index, rating) => {
    setRecipes((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], rating };
      return copy;
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl text-4xl">
                🐔
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-orange-600 to-green-600 bg-clip-text text-transparent mb-4">
            Your AI Chef Awaits
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your ingredients into culinary masterpieces with our smart recipe generator
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-6">
          <NotificationsBanner />

          {/* Ingredient Input */}
          <IngredientInput 
            ingredients={ingredients}
            setIngredients={setIngredients}
            onGenerate={generateRecipe}
            isGenerating={isGenerating}
            preference={preference}
            setPreference={setPreference}
            onSurprise={surpriseMe}
            language={language}
            setLanguage={setLanguage}
          />

          {/* Loading State */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-orange-500 rounded-2xl flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-br from-green-500/20 to-orange-500/20 rounded-3xl animate-pulse"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Cooking up something amazing...</h3>
                <p className="text-gray-600">Our AI chef is crafting the perfect recipe for you</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Multiple Recipe Results */}
          <AnimatePresence>
            {recipes.length > 0 && (
              <div className="grid grid-cols-1 gap-8">
                {recipes.map((r, idx) => (
                  <RecipeCard
                    key={idx}
                    recipe={r}
                    onSave={() => saveRecipe(r)}
                    isSaving={isSaving}
                    canSave={!!user}
                    onRate={(val) => rateRecipe(idx, val)}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}