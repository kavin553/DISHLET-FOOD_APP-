
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User, BookOpen, Sparkles, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User as UserEntity } from "@/entities/User";

export default function Layout({ children }) {
  const location = useLocation(); // Ensure useLocation is used
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await UserEntity.me();
        setUser(currentUser);
      } catch (error) {
        // User not logged in
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await UserEntity.logout();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-yellow-50">
      <style>{`
        :root {
          --foody-green: #4CAF50;
          --foody-orange: #FF9800;
          --foody-yellow: #FFEB3B;
        }
        .foody-pattern {
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 152, 0, 0.1) 0%, transparent 50%);
        }
        .foody-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(76, 175, 80, 0.2);
        }
      `}</style>
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl("RecipeGenerator")} className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200 text-xl">
                  🐔
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
                  Dishlet
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Smart Recipes on the Go</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to={createPageUrl("RecipeGenerator")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === createPageUrl("RecipeGenerator")
                    ? "bg-green-100 text-green-700"
                    : "text-gray-600 hover:text-green-600"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">Generate Recipe</span>
              </Link>
              
              <Link
                to={createPageUrl("Profile")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === createPageUrl("Profile")
                    ? "bg-green-100 text-green-700"
                    : "text-gray-600 hover:text-green-600"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="font-medium">My Recipes</span>
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user?.streak_count ? (
                <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-orange-50 text-orange-700 rounded-full border border-orange-200">
                  <Flame className="w-4 h-4" />
                  <span className="text-sm">{user.streak_count}d</span>
                </div>
              ) : null}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-gradient-to-br from-green-100 to-orange-100 hover:from-green-200 hover:to-orange-200">
                      <User className="h-5 w-5 text-green-700" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.full_name}</p>
                        <p className="text-xs leading-none text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl("Profile")} className="cursor-pointer">
                        <BookOpen className="mr-2 h-4 w-4" />
                        My Recipes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => UserEntity.login()} className="bg-green-600 hover:bg-green-700">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white/80 backdrop-blur-md border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8 py-3">
            <Link
              to={createPageUrl("RecipeGenerator")}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === createPageUrl("RecipeGenerator")
                  ? "bg-green-100 text-green-700"
                  : "text-gray-600"
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-medium">Generate</span>
            </Link>
            
            <Link
              to={createPageUrl("Profile")}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === createPageUrl("Profile")
                  ? "bg-green-100 text-green-700"
                  : "text-gray-600"
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-xs font-medium">Recipes</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="foody-pattern min-h-screen">
        {children}
      </main>
    </div>
  );
}
