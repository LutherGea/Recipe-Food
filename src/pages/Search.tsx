import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RecipeCard from '@/components/RecipeCard';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { searchRecipes, dummyRecipes } from '@/services/api';
import { Recipe } from '@/contexts/FavoritesContext';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  const recipesPerPage = 12;

  useEffect(() => {
    const query = searchParams.get('q') || '';
    const diet = searchParams.get('diet') || '';
    const type = searchParams.get('type') || '';

    if (query || diet || type) {
      handleSearch(query, diet || undefined, type || undefined);
    }
  }, [searchParams]);

  const handleSearch = async (query: string, diet?: string, type?: string, page: number = 1) => {
    setLoading(true);
    setHasSearched(true);
    
    try {
      const offset = (page - 1) * recipesPerPage;
      const response = await searchRecipes(query, diet, type, recipesPerPage, offset);
      
      setRecipes(response.results);
      setTotalResults(response.totalResults);
      setCurrentPage(page);

      // Update URL params
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (diet) params.set('diet', diet);
      if (type) params.set('type', type);
      if (page > 1) params.set('page', page.toString());
      setSearchParams(params);

      toast({
        title: "Search Complete",
        description: `Found ${response.totalResults} recipes`
      });
    } catch (error) {
      console.warn('Search failed, using dummy data:', error);
      
      // Filter dummy data based on search criteria
      let filtered = dummyRecipes.results;
      
      if (query) {
        filtered = filtered.filter(recipe =>
          recipe.title.toLowerCase().includes(query.toLowerCase()) ||
          (recipe.summary && recipe.summary.toLowerCase().includes(query.toLowerCase()))
        );
      }
      
      setRecipes(filtered);
      setTotalResults(filtered.length);
      setCurrentPage(1);
      
      toast({
        title: "Demo Search",
        description: "Using sample data for demonstration"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    const query = searchParams.get('q') || '';
    const diet = searchParams.get('diet') || '';
    const type = searchParams.get('type') || '';
    handleSearch(query, diet || undefined, type || undefined, page);
  };

  const clearSearch = () => {
    setRecipes([]);
    setTotalResults(0);
    setCurrentPage(1);
    setHasSearched(false);
    setSearchParams({});
  };

  const totalPages = Math.ceil(totalResults / recipesPerPage);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-warm bg-clip-text text-transparent flex items-center justify-center">
              <SearchIcon className="mr-3 h-10 w-10 text-primary" />
              Search Recipes
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Find the perfect recipe for any occasion
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-semibold">Search Results</h2>
                {totalResults > 0 && (
                  <span className="text-muted-foreground">
                    {totalResults} recipe{totalResults !== 1 ? 's' : ''} found
                  </span>
                )}
              </div>
              
              <Button variant="outline" onClick={clearSearch} className="flex items-center space-x-2">
                <X className="h-4 w-4" />
                <span>Clear Search</span>
              </Button>
            </div>

            {/* Active Filters */}
            {(searchParams.get('q') || searchParams.get('diet') || searchParams.get('type')) && (
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-sm text-muted-foreground flex items-center">
                  <Filter className="h-4 w-4 mr-1" />
                  Active filters:
                </span>
                {searchParams.get('q') && (
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    "{searchParams.get('q')}"
                  </span>
                )}
                {searchParams.get('diet') && (
                  <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                    Diet: {searchParams.get('diet')}
                  </span>
                )}
                {searchParams.get('type') && (
                  <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                    Type: {searchParams.get('type')}
                  </span>
                )}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted rounded-xl h-64 mb-4"></div>
                    <div className="bg-muted rounded h-4 mb-2"></div>
                    <div className="bg-muted rounded h-4 w-3/4"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Results Grid */}
            {!loading && recipes.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex space-x-1">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            onClick={() => handlePageChange(page)}
                            className="w-10"
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* No Results */}
            {!loading && hasSearched && recipes.length === 0 && (
              <div className="text-center py-12">
                <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or browse our categories
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={clearSearch}>
                    New Search
                  </Button>
                  <Button variant="outline" onClick={() => handleSearch('')}>
                    Browse All Recipes
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Default State */}
        {!hasSearched && (
          <div className="text-center py-16">
            <div className="bg-primary/10 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <SearchIcon className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Start Your Recipe Search</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Use the search bar above to find recipes by name, ingredients, diet type, or meal category.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="outline" onClick={() => handleSearch('chicken')}>
                Chicken Recipes
              </Button>
              <Button variant="outline" onClick={() => handleSearch('', 'vegetarian')}>
                Vegetarian
              </Button>
              <Button variant="outline" onClick={() => handleSearch('', '', 'dessert')}>
                Desserts
              </Button>
              <Button variant="outline" onClick={() => handleSearch('pasta')}>
                Pasta Dishes
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;