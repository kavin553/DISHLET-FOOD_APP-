
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat, Heart, Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";
import RatingStars from "./RatingStars";
import ShareButtons from "./ShareButtons";

export default function RecipeCard({ recipe, onSave, isSaving, canSave, onRate }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-700 border-green-200";
      case "Medium": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Hard": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="foody-card border-green-200 shadow-2xl overflow-hidden">
        {recipe.image_url ? (
          <div className="relative">
            <img
              src={recipe.image_url}
              alt={recipe.name}
              className="w-full h-56 md:h-72 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow">
                {recipe.name}
              </h2>
              {canSave && (
                <Button
                  onClick={onSave}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 flex items-center space-x-2 shadow-lg text-white"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4" />
                      <span>Save Recipe</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <CardHeader className="bg-gradient-to-r from-green-50 to-orange-50 border-b border-green-100">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800">
                  {recipe.name}
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  {recipe.difficulty && (
                    <Badge className={getDifficultyColor(recipe.difficulty) + " border font-medium"}>
                      {recipe.difficulty}
                    </Badge>
                  )}
                  {recipe.cuisine && (
                    <Badge variant="outline" className="border-orange-200 text-orange-700 font-medium">
                      {recipe.cuisine}
                    </Badge>
                  )}
                </div>
              </div>
              {canSave && (
                <Button
                  onClick={onSave}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 flex items-center space-x-2 shadow-lg"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4" />
                      <span>Save Recipe</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
        )}

        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {recipe.cooking_time && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="font-medium">{recipe.cooking_time}</span>
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  <span className="font-medium">{recipe.servings} servings</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <RatingStars value={recipe.rating || 0} onChange={onRate} />
              <ShareButtons title={recipe.name} text={`Check out this recipe: ${recipe.name}!`} />
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">🥘</span>
              </div>
              <span>Ingredients</span>
            </h3>
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <p className="text-gray-700 leading-relaxed">{recipe.ingredients}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4 mt-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <ChefHat className="w-4 h-4 text-white" />
              </div>
              <span>Instructions</span>
            </h3>
            <div className="space-y-4">
              {recipe.instructions?.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex space-x-4 group"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-orange-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform duration-200">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-700 leading-relaxed">{step}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
