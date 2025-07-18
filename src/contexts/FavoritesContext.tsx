import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes?: number;
  servings?: number;
  summary?: string;
  instructions?: string;
  extendedIngredients?: any[];
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
    // Load favorites from localStorage
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const saveFavorites = (newFavorites: Recipe[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const addToFavorites = (recipe: Recipe) => {
    const newFavorite = {
      ...recipe,
      rating: 0,
      notes: '',
      dateAdded: new Date().toISOString()
    };
    const newFavorites = [...favorites, newFavorite];
    saveFavorites(newFavorites);
  };

  const removeFromFavorites = (id: number) => {
    const newFavorites = favorites.filter(recipe => recipe.id !== id);
    saveFavorites(newFavorites);
  };

  const isFavorite = (id: number) => {
    return favorites.some(recipe => recipe.id === id);
  };

  const updateFavoriteNotes = (id: number, notes: string) => {
    const newFavorites = favorites.map(recipe =>
      recipe.id === id ? { ...recipe, notes } : recipe
    );
    saveFavorites(newFavorites);
  };

  const updateFavoriteRating = (id: number, rating: number) => {
    const newFavorites = favorites.map(recipe =>
      recipe.id === id ? { ...recipe, rating } : recipe
    );
    saveFavorites(newFavorites);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    updateFavoriteNotes,
    updateFavoriteRating
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};