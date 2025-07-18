import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RecipeCard from '@/components/RecipeCard';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Search, Filter, Star, Calendar, SortAsc } from 'lucide-react';

const Favorites: React.FC = () => {
  const { favorites } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterByRating, setFilterByRating] = useState('all');

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-destructive/10 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Heart className="h-12 w-12 text-destructive" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Login Required</h2>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to view your favorite recipes.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button>Login Now</Button>
            </Link>
            <Link to="/">
              <Button variant="outline">Browse Recipes</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter and sort favorites
  let filteredFavorites = favorites.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (recipe.notes && recipe.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter by rating
  if (filterByRating !== 'all') {
    const minRating = parseInt(filterByRating);
    filteredFavorites = filteredFavorites.filter(recipe => 
      (recipe.rating || 0) >= minRating
    );
  }

  // Sort favorites
  filteredFavorites.sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime();
      case 'oldest':
        return new Date(a.dateAdded || 0).getTime() - new Date(b.dateAdded || 0).getTime();
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-warm bg-clip-text text-transparent flex items-center justify-center">
              <Heart className="mr-3 h-10 w-10 text-red-500 fill-current" />
              My Favorite Recipes
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Your personal collection of saved recipes
          </p>
        </div>

        {favorites.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="bg-muted rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <Heart className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">No favorite recipes yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start building your recipe collection by clicking the heart icon on recipes you love.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/">
                <Button size="lg">
                  Discover Recipes
                </Button>
              </Link>
              <Link to="/search">
                <Button size="lg" variant="outline">
                  Search Recipes
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Search and Filter Bar */}
            <Card className="mb-8 bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search your favorites..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SortAsc className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Recently Added</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="title">A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Select value={filterByRating} onValueChange={setFilterByRating}>
                      <SelectTrigger>
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ratings</SelectItem>
                        <SelectItem value="5">5 Stars Only</SelectItem>
                        <SelectItem value="4">4+ Stars</SelectItem>
                        <SelectItem value="3">3+ Stars</SelectItem>
                        <SelectItem value="2">2+ Stars</SelectItem>
                        <SelectItem value="1">1+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Search Summary */}
                <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                  <span>
                    Showing {filteredFavorites.length} of {favorites.length} favorite recipe{favorites.length !== 1 ? 's' : ''}
                  </span>
                  
                  {(searchQuery || filterByRating !== 'all' || sortBy !== 'recent') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchQuery('');
                        setFilterByRating('all');
                        setSortBy('recent');
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Favorites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{favorites.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Average Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-1">
                    <span className="text-2xl font-bold text-warning">
                      {favorites.length > 0
                        ? (favorites.reduce((sum, recipe) => sum + (recipe.rating || 0), 0) / favorites.length).toFixed(1)
                        : '0.0'}
                    </span>
                    <Star className="h-5 w-5 fill-warning text-warning" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    With Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">
                    {favorites.filter(recipe => recipe.notes && recipe.notes.trim()).length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Favorites Grid */}
            {filteredFavorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFavorites.map((recipe) => (
                  <div key={recipe.id} className="space-y-2">
                    <RecipeCard recipe={recipe} />
                    
                    {/* Additional Info for Favorites */}
                    <div className="px-2 space-y-1 text-xs text-muted-foreground">
                      {recipe.dateAdded && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Added {new Date(recipe.dateAdded).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {recipe.notes && recipe.notes.trim() && (
                        <div className="bg-muted/50 rounded p-2 text-xs">
                          <strong>Your notes:</strong> {recipe.notes.slice(0, 100)}
                          {recipe.notes.length > 100 && '...'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* No Results */
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No recipes match your filters</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterByRating('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;