
import React, { useState, useEffect } from "react";
import { Recipe } from "@/entities/Recipe";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, ChefHat, Heart, BookOpen, Sparkles, Flame, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import RatingStars from "../components/RatingStars";
import ShareButtons from "../components/ShareButtons";

export default function Profile() {
  const [recipes, setRecipes] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        const userRecipes = await Recipe.filter({ created_by: currentUser.email }, "-created_date");
        setRecipes(userRecipes);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-700 border-green-200";
      case "Medium": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Hard": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const updateRating = async (id, rating) => {
    await Recipe.update(id, { rating });
    setRecipes((prev) => prev.map(r => r.id === id ? { ...r, rating } : r));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Please Sign In</h2>
          <p className="text-gray-500 mb-4">Sign in to view your saved recipes</p>
          <Button onClick={() => User.login()} className="bg-green-600 hover:bg-green-700">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-green-100 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <ChefHat className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    Welcome back, {user.full_name?.split(' ')[0]}!
                  </h1>
                  <p className="text-gray-600 text-lg">Your culinary journey continues</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600">{recipes.length} Recipes Saved</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-gray-600">Food Explorer</span>
                    </div>
                  </div>
                </div>
              </div>
              <Link to={createPageUrl("RecipeGenerator")}>
                <Button className="bg-green-600 hover:bg-green-700 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Generate New Recipe</span>
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="flex flex-wrap items-center gap-4">
            {user.streak_count ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full border border-orange-200">
                <Flame className="w-4 h-4" />
                <span>{user.streak_count} days cooking streak</span>
              </div>
            ) : null}
            <div className="flex items-center gap-2 flex-wrap">
              {(user.badges || []).map((b) => (
                <div key={b} className="flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-200 text-sm">
                  <Award className="w-3.5 h-3.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recipes Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded-md"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">No recipes saved yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start your culinary adventure by generating your first AI-powered recipe!
            </p>
            <Link to={createPageUrl("RecipeGenerator")}>
              <Button className="bg-green-600 hover:bg-green-700 flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Generate Your First Recipe</span>
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
              >
                <Card className="foody-card border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  {recipe.image_url && (
                    <img src={recipe.image_url} alt={recipe.name} className="w-full h-40 object-cover" />
                  )}
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-bold text-gray-800 line-clamp-2">
                      {recipe.name}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {recipe.difficulty && (
                        <Badge className={getDifficultyColor(recipe.difficulty) + " border"}>
                          {recipe.difficulty}
                        </Badge>
                      )}
                      {recipe.cuisine && (
                        <Badge variant="outline" className="border-orange-200 text-orange-700">
                          {recipe.cuisine}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <RatingStars value={recipe.rating || 0} onChange={(v) => updateRating(recipe.id, v)} />
                      <ShareButtons title={recipe.name} text={`Check my saved recipe: ${recipe.name}`} />
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      <span className="font-medium">Ingredients:</span> {recipe.ingredients}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        {recipe.cooking_time && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{recipe.cooking_time}</span>
                          </div>
                        )}
                        {recipe.servings && (
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{recipe.servings} servings</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2">
                      <details className="group">
                        <summary className="cursor-pointer font-medium text-green-700 hover:text-green-800 flex items-center space-x-2">
                          <span>View Instructions</span>
                          <ChefHat className="w-4 h-4 group-open:rotate-180 transition-transform duration-200" />
                        </summary>
                        <div className="mt-3 space-y-2">
                          {recipe.instructions?.map((step, stepIndex) => (
                            <div key={stepIndex} className="flex space-x-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">
                                {stepIndex + 1}
                              </span>
                              <p className="text-sm text-gray-600">{step}</p>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
