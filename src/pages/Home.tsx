import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import RecipeCard from '@/components/RecipeCard';
import SearchBar from '@/components/SearchBar';
import { searchRecipes, getRandomRecipes, dummyRecipes } from '@/services/api';
import { Recipe } from '@/contexts/FavoritesContext';
import { ChefHat, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Home: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [randomRecipe, setRandomRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    loadFeaturedRecipes();
    loadRandomRecipe();
  }, []);

  const loadFeaturedRecipes = async () => {
    setLoading(true);
    try {
      const response = await searchRecipes('', undefined, undefined, 8);
      setRecipes(response.results);
    } catch (error) {
      console.warn('Using dummy data due to API error:', error);
      // Use dummy data as fallback
      setRecipes(dummyRecipes.results.slice(0, 8));
      toast({
        title: "Menggunakan Data Demo",
        description: "API sementara tidak tersedia, menampilkan resep contoh"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRandomRecipe = async () => {
    try {
      const response = await getRandomRecipes(1);
      if (response.recipes && response.recipes.length > 0) {
        setRandomRecipe(response.recipes[0]);
      }
    } catch (error) {
      console.warn('Could not load random recipe:', error);
      // Use a random recipe from dummy data
      const randomIndex = Math.floor(Math.random() * dummyRecipes.results.length);
      setRandomRecipe(dummyRecipes.results[randomIndex]);
    }
  };

  const handleSearch = async (query: string, diet?: string, type?: string) => {
    setSearchLoading(true);
    try {
      const response = await searchRecipes(query, diet, type, 12);
      setRecipes(response.results);
      toast({
        title: "Pencarian Selesai",
        description: `Ditemukan ${response.totalResults} resep`
      });
    } catch (error) {
      console.warn('Search failed, using dummy data:', error);
      // Filter dummy data based on query
      const filtered = dummyRecipes.results.filter(recipe =>
        recipe.title.toLowerCase().includes(query.toLowerCase())
      );
      setRecipes(filtered.length > 0 ? filtered : dummyRecipes.results);
      toast({
        title: "Pencarian Demo",
        description: "Menggunakan data contoh untuk demonstrasi"
      });
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <ChefHat className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Temukan Resep{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Menakjubkan
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Temukan resep yang sempurna untuk setiap kesempatan. Dari makan malam cepat hingga perayaan spesial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/search">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Jelajahi Resep
                </Button>
              </Link>
              <Link to="/categories">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Telusuri Kategori
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Search */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="bg-gradient-warm bg-clip-text text-transparent">
                Temukan Resep Sempurna Anda
              </span>
            </h2>
            <SearchBar onSearch={handleSearch} loading={searchLoading} />
          </div>
        </section>

        {/* Random Recipe of the Day */}
        {randomRecipe && (
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">
                <span className="bg-gradient-fresh bg-clip-text text-transparent">
                  Resep Hari Ini
                </span>
              </h2>
              <p className="text-muted-foreground">Temukan sesuatu yang baru dan lezat</p>
            </div>
            
            <Card className="max-w-4xl mx-auto bg-gradient-card border-border/50 shadow-card overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative">
                    <img
                      src={randomRecipe.image}
                      alt={randomRecipe.title}
                      className="w-full h-64 md:h-80 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=400&h=300&fit=crop';
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <div className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <Sparkles className="h-4 w-4 mr-1" />
                        Unggulan
                      </div>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-4">{randomRecipe.title}</h3>
                    {randomRecipe.summary && (
                      <p className="text-muted-foreground mb-6 line-clamp-3">
                        {randomRecipe.summary.replace(/<[^>]*>/g, '')}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mb-6 text-sm text-muted-foreground">
                      {randomRecipe.readyInMinutes && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {randomRecipe.readyInMinutes} menit
                        </div>
                      )}
                    </div>
                    <Link to={`/recipe/${randomRecipe.id}`}>
                      <Button size="lg" className="bg-gradient-fresh hover:opacity-90">
                        Coba Resep Ini
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Featured Recipes */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                <span className="bg-gradient-warm bg-clip-text text-transparent flex items-center">
                  <TrendingUp className="mr-2 h-8 w-8 text-primary" />
                  Resep Unggulan
                </span>
              </h2>
              <p className="text-muted-foreground">Resep populer dari komunitas kami</p>
            </div>
            <Link to="/search">
              <Button variant="outline">
                Lihat Semua Resep
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-xl h-64 mb-4"></div>
                  <div className="bg-muted rounded h-4 mb-2"></div>
                  <div className="bg-muted rounded h-4 w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}

          {recipes.length === 0 && !loading && (
            <div className="text-center py-12">
              <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tidak ada resep ditemukan</h3>
              <p className="text-muted-foreground mb-4">Coba sesuaikan kriteria pencarian Anda</p>
              <Button onClick={() => handleSearch('')}>
                Muat Resep Default
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;