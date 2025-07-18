import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import { getRecipeById, dummyRecipes } from '@/services/api';
import { Recipe } from '@/contexts/FavoritesContext';
import { 
  Heart, 
  Clock, 
  Users, 
  Star, 
  ChefHat, 
  ArrowLeft,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToFavorites, removeFromFavorites, isFavorite, updateFavoriteNotes, updateFavoriteRating } = useFavorites();
  const { isAuthenticated } = useAuth();
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [editingNotes, setEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');

  const recipeId = parseInt(id || '0');
  const favorite = isFavorite(recipeId);

  useEffect(() => {
    loadRecipe();
  }, [id]);

  useEffect(() => {
    if (favorite && recipe) {
      // Load saved rating and notes from favorites
      const favoriteRecipe = useFavorites().favorites.find(f => f.id === recipe.id);
      if (favoriteRecipe) {
        setRating(favoriteRecipe.rating || 0);
        setNotes(favoriteRecipe.notes || '');
      }
    }
  }, [favorite, recipe]);

  const loadRecipe = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const recipeData = await getRecipeById(parseInt(id));
      setRecipe(recipeData);
    } catch (error) {
      console.warn('Failed to load recipe, using dummy data:', error);
      
      // Find recipe in dummy data
      const dummyRecipe = dummyRecipes.results.find(r => r.id === parseInt(id));
      if (dummyRecipe) {
        // Enhance dummy recipe with additional details
        setRecipe({
          ...dummyRecipe,
          instructions: "1. Prep all ingredients according to the recipe requirements.\n2. Follow traditional cooking methods for best results.\n3. Season to taste and adjust cooking time as needed.\n4. Serve hot and enjoy!",
          extendedIngredients: [
            { id: 1, name: "Main ingredient", amount: 2, unit: "cups" },
            { id: 2, name: "Secondary ingredient", amount: 1, unit: "tbsp" },
            { id: 3, name: "Seasoning", amount: 1, unit: "tsp" }
          ]
        });
      }
      
      toast({
        title: "Demo Recipe",
        description: "Using sample data for demonstration"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to add recipes to favorites",
        variant: "destructive"
      });
      return;
    }

    if (!recipe) return;

    if (favorite) {
      removeFromFavorites(recipe.id);
      toast({
        title: "Removed from favorites",
        description: `${recipe.title} has been removed from your favorites`
      });
    } else {
      addToFavorites(recipe);
      toast({
        title: "Added to favorites",
        description: `${recipe.title} has been added to your favorites`
      });
    }
  };

  const handleRatingChange = (newRating: number) => {
    if (!isAuthenticated || !recipe) return;
    
    setRating(newRating);
    if (favorite) {
      updateFavoriteRating(recipe.id, newRating);
      toast({
        title: "Rating saved",
        description: `You rated this recipe ${newRating} star${newRating !== 1 ? 's' : ''}`
      });
    }
  };

  const handleSaveNotes = () => {
    if (!recipe) return;
    
    setNotes(tempNotes);
    if (favorite) {
      updateFavoriteNotes(recipe.id, tempNotes);
      toast({
        title: "Notes saved",
        description: "Your recipe notes have been updated"
      });
    }
    setEditingNotes(false);
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="bg-muted rounded h-8 w-48"></div>
            <div className="bg-muted rounded-xl h-64"></div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <div className="bg-muted rounded h-6 w-full"></div>
                <div className="bg-muted rounded h-4 w-3/4"></div>
                <div className="bg-muted rounded h-4 w-2/3"></div>
              </div>
              <div className="space-y-4">
                <div className="bg-muted rounded h-32"></div>
                <div className="bg-muted rounded h-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Recipe not found</h2>
          <p className="text-muted-foreground mb-6">The recipe you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Recipes</span>
            </Button>
          </Link>
        </div>

        {/* Recipe Header */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="relative">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-card"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=600&h=400&fit=crop';
              }}
            />
            <Button
              size="lg"
              className="absolute top-4 right-4 bg-white/90 hover:bg-white shadow-lg"
              onClick={handleFavoriteClick}
            >
              <Heart 
                className={`h-5 w-5 ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
              />
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
              {recipe.summary && (
                <p className="text-lg text-muted-foreground">
                  {stripHtml(recipe.summary)}
                </p>
              )}
            </div>

            {/* Recipe Info */}
            <div className="flex flex-wrap gap-4">
              {recipe.readyInMinutes && (
                <Badge variant="secondary" className="flex items-center space-x-1 px-3 py-2">
                  <Clock className="h-4 w-4" />
                  <span>{recipe.readyInMinutes} minutes</span>
                </Badge>
              )}
              {recipe.servings && (
                <Badge variant="secondary" className="flex items-center space-x-1 px-3 py-2">
                  <Users className="h-4 w-4" />
                  <span>{recipe.servings} servings</span>
                </Badge>
              )}
            </div>

            {/* Rating */}
            {isAuthenticated && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5" />
                    <span>Your Rating</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingChange(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      You rated this recipe {rating} star{rating !== 1 ? 's' : ''}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Recipe Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recipe.extendedIngredients && recipe.extendedIngredients.length > 0 ? (
                    recipe.extendedIngredients.map((ingredient, index) => (
                      <li key={ingredient.id || index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>
                          {ingredient.amount} {ingredient.unit} {ingredient.name}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground">Ingredient list not available</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none">
                  {recipe.instructions ? (
                    <div className="whitespace-pre-line">
                      {stripHtml(recipe.instructions)}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Instructions not available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Personal Notes */}
            {isAuthenticated && favorite && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Edit3 className="h-5 w-5" />
                      <span>Your Notes</span>
                    </span>
                    {!editingNotes && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingNotes(true);
                          setTempNotes(notes);
                        }}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editingNotes ? (
                    <div className="space-y-3">
                      <Textarea
                        value={tempNotes}
                        onChange={(e) => setTempNotes(e.target.value)}
                        placeholder="Add your personal notes about this recipe..."
                        rows={4}
                      />
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={handleSaveNotes}>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingNotes(false)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {notes ? (
                        <p className="whitespace-pre-line">{notes}</p>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          Click edit to add your personal notes about this recipe
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  variant={favorite ? "destructive" : "default"}
                  onClick={handleFavoriteClick}
                >
                  <Heart className={`h-4 w-4 mr-2 ${favorite ? 'fill-current' : ''}`} />
                  {favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
                
                <Link to="/search" className="block">
                  <Button variant="outline" className="w-full">
                    Find Similar Recipes
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recipe Facts */}
            <Card>
              <CardHeader>
                <CardTitle>Recipe Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prep Time:</span>
                  <span>{recipe.readyInMinutes ? `${recipe.readyInMinutes} minutes` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Servings:</span>
                  <span>{recipe.servings || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recipe ID:</span>
                  <span>#{recipe.id}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;