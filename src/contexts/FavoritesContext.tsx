import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes?: number;
  servings?: number;
  summary?: string;
  instructions?: string;
  extendedIngredients?: {
    id?: number;
    name: string;
    amount: number;
    unit: string;
  }[];
  rating?: number;
  notes?: string;
  dateAdded?: string;
}

interface FavoritesContextType {
  favorites: Recipe[];
  addToFavorites: (recipe: Recipe) => void;
  removeFromFavorites: (id: number) => void;
  isFavorite: (id: number) => boolean;
  updateFavoriteNotes: (id: number, notes: string) => void;
  updateFavoriteRating: (id: number, rating: number) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: React.ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      try {
        const parsed = JSON.parse(storedFavorites);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      } catch (error) {
        console.error("Failed to parse favorites from localStorage:", error);
      }
    }
  }, []);

  const saveFavorites = (newFavorites: Recipe[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const addToFavorites = (recipe: Recipe) => {
    if (favorites.some(fav => fav.id === recipe.id)) return;

    const newFavorite: Recipe = {
      ...recipe,
      rating: 0,
      notes: '',
      dateAdded: new Date().toISOString(),
      extendedIngredients: recipe.extendedIngredients ?? [],
    };
    saveFavorites([...favorites, newFavorite]);
  };

  const removeFromFavorites = (id: number) => {
    const updated = favorites.filter(recipe => recipe.id !== id);
    saveFavorites(updated);
  };

  const isFavorite = (id: number) => {
    return favorites.some(recipe => recipe.id === id);
  };

  const updateFavoriteNotes = (id: number, notes: string) => {
    const updated = favorites.map(recipe =>
      recipe.id === id ? { ...recipe, notes } : recipe
    );
    saveFavorites(updated);
  };

  const updateFavoriteRating = (id: number, rating: number) => {
    const updated = favorites.map(recipe =>
      recipe.id === id ? { ...recipe, rating } : recipe
    );
    saveFavorites(updated);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        updateFavoriteNotes,
        updateFavoriteRating,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
