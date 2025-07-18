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
  const {
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    updateFavoriteNotes,
    updateFavoriteRating,
    favorites // <- FIX: ambil dari awal
  } = useFavorites();
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
      const favoriteRecipe = favorites.find(f => f.id === recipe.id);
      if (favoriteRecipe) {
        setRating(favoriteRecipe.rating || 0);
        setNotes(favoriteRecipe.notes || '');
      }
    }
  }, [favorite, recipe, favorites]);

  const loadRecipe = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const recipeData = await getRecipeById(parseInt(id));
      setRecipe(recipeData);
    } catch (error) {
      const dummyRecipe = dummyRecipes.results.find(r => r.id === parseInt(id));
      if (dummyRecipe) {
        setRecipe({
          ...dummyRecipe,
          instructions: "1. Prep ingredients.\n2. Cook properly.\n3. Season and serve!",
          extendedIngredients: [
            { id: 1, name: "Ingredient A", amount: 2, unit: "cups" },
            { id: 2, name: "Ingredient B", amount: 1, unit: "tbsp" }
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
        description: `${recipe.title} removed from your favorites`
      });
    } else {
      addToFavorites(recipe);
      toast({
        title: "Added to favorites",
        description: `${recipe.title} added to your favorites`
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
    return <div className="p-8 text-center">Loading recipe...</div>;
  }

  if (!recipe) {
    return (
      <div className="text-center py-16">
        <ChefHat className="mx-auto mb-4 w-16 h-16 text-muted" />
        <h2 className="text-xl font-semibold mb-2">Recipe Not Found</h2>
        <Link to="/"><Button>Back to Home</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto max-w-6xl space-y-8">
        <div className="flex justify-between items-center">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <Button onClick={handleFavoriteClick}>
            <Heart className={`h-4 w-4 mr-2 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
            {favorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <img
            src={recipe.image}
            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x300')}
            alt={recipe.title}
            className="rounded-xl shadow"
          />

          <div>
            <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
            {recipe.summary && <p className="text-muted-foreground mb-4">{stripHtml(recipe.summary)}</p>}

            <div className="flex gap-4 mb-4">
              {recipe.readyInMinutes && (
                <Badge variant="secondary">
                  <Clock className="mr-1 h-4 w-4" />
                  {recipe.readyInMinutes} min
                </Badge>
              )}
              {recipe.servings && (
                <Badge variant="secondary">
                  <Users className="mr-1 h-4 w-4" />
                  {recipe.servings} servings
                </Badge>
              )}
            </div>

            {isAuthenticated && (
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Rating
                </h3>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => handleRatingChange(n)}>
                      <Star
                        className={`h-5 w-5 ${rating >= n ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Ingredients</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1">
                  {recipe.extendedIngredients?.length ? (
                    recipe.extendedIngredients.map((ing, i) => (
                      <li key={ing.id || i}>
                        {ing.amount} {ing.unit} {ing.name}
                      </li>
                    ))
                  ) : (
                    <li>Data not available</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Instructions</CardTitle></CardHeader>
              <CardContent>
                {recipe.instructions ? (
                  <pre className="whitespace-pre-line">{stripHtml(recipe.instructions)}</pre>
                ) : (
                  <p>No instructions available.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {isAuthenticated && favorite && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  {editingNotes ? (
                    <div className="space-y-2">
                      <Textarea
                        value={tempNotes}
                        onChange={(e) => setTempNotes(e.target.value)}
                        rows={4}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveNotes}><Save className="mr-1 h-4 w-4" /> Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingNotes(false)}>
                          <X className="mr-1 h-4 w-4" /> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {notes ? (
                        <p className="whitespace-pre-line">{notes}</p>
                      ) : (
                        <p className="text-muted-foreground text-sm">No notes yet. Click edit to add some.</p>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => {
                        setEditingNotes(true);
                        setTempNotes(notes);
                      }}>
                        <Edit3 className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
