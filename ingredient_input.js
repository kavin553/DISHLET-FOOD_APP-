
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function IngredientInput({ ingredients, setIngredients, onGenerate, isGenerating, preference, setPreference, onSurprise, language, setLanguage }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      onGenerate();
    }
  };

  const suggestionIngredients = [
    "chicken, tomatoes, garlic",
    "pasta, cheese, basil",
    "rice, vegetables, soy sauce",
    "salmon, lemon, herbs",
    "potatoes, onions, butter"
  ];

  const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "es", label: "Spanish" },
    { code: "fr", label: "French" },
    { code: "de", label: "German" },
    { code: "it", label: "Italian" },
    { code: "hi", label: "Hindi" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="foody-card border-green-200 shadow-xl">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Dishlet 🐔 - What's in your kitchen?</h2>
              <p className="text-gray-600">Tell us your ingredients and we'll create magic</p>
            </div>
            
            <div className="relative">
              <Textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter your ingredients here... (e.g., chicken, rice, vegetables, garlic, onion)"
                className="min-h-[120px] text-lg border-2 border-green-200 focus:border-green-400 rounded-xl resize-none"
                disabled={isGenerating}
              />
              {ingredients && (
                <div className="absolute top-3 right-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-500">Quick suggestions:</span>
              {suggestionIngredients.slice(0, 3).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setIngredients(suggestion)}
                  className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                  disabled={isGenerating}
                >
                  {suggestion}
                </button>
              ))}
            </div>
              
            <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:items-center">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 whitespace-nowrap">Preference:</span>
                <Select value={preference} onValueChange={setPreference}>
                  <SelectTrigger className="w-[180px] border-green-200 focus:border-green-400">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veg">Veg</SelectItem>
                    <SelectItem value="non_veg">Non-Veg</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="healthy">Healthy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 whitespace-nowrap">Instructions Language:</span>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[200px] border-green-200 focus:border-green-400">
                    <SelectValue placeholder="English (default)" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(l => (
                      <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3 md:justify-end">
                <Button
                  onClick={onGenerate}
                  disabled={!ingredients.trim() || isGenerating}
                  className="bg-gradient-to-r from-green-600 to-orange-600 hover:from-green-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Cooking...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Generate Recipes</span>
                    </>
                  )}
                </Button>

                <Button
                  onClick={onSurprise}
                  disabled={isGenerating}
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50 rounded-xl"
                >
                  Surprise Me 🍳
                </Button>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 text-center">
              💡 Tip: Press Ctrl+Enter to quickly generate your recipe
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
