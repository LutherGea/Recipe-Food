import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Clock, Users, Star } from 'lucide-react';
import { Recipe } from '@/contexts/FavoritesContext';
import { toast } from '@/hooks/use-toast';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const favorite = isFavorite(recipe.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Perlu Login",
        description: "Silakan login untuk menambahkan resep ke favorit",
        variant: "destructive"
      });
      return;
    }

    if (favorite) {
      removeFromFavorites(recipe.id);
      toast({
        title: "Dihapus dari favorit",
        description: `${recipe.title} telah dihapus dari favorit Anda`
      });
    } else {
      addToFavorites(recipe);
      toast({
        title: "Ditambahkan ke favorit",
        description: `${recipe.title} telah ditambahkan ke favorit Anda`
      });
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <Card className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50 overflow-hidden">
      <Link to={`/recipe/${recipe.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=400&h=300&fit=crop';
            }}
          />
          
          {/* Favorite Button */}
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-2 right-2 bg-white/90 hover:bg-white shadow-md"
            onClick={handleFavoriteClick}
          >
            <Heart 
              className={`h-4 w-4 ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </Button>

          {/* Rating Badge */}
          {recipe.rating !== undefined && recipe.rating > 0 && (
            <Badge className="absolute top-2 left-2 bg-warning text-warning-foreground">
              <Star className="h-3 w-3 mr-1 fill-current" />
              {recipe.rating}
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link to={`/recipe/${recipe.id}`}>
          <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {recipe.title}
          </h3>
        </Link>
        
        {recipe.summary && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {stripHtml(recipe.summary)}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            {recipe.readyInMinutes && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{recipe.readyInMinutes} menit</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{recipe.servings} porsi</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link to={`/recipe/${recipe.id}`} className="w-full">
          <Button className="w-full bg-gradient-warm hover:opacity-90 transition-opacity">
            Lihat Resep
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;