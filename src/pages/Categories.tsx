import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import RecipeCard from '@/components/RecipeCard';
import { getRecipesByCategory, dummyRecipes } from '@/services/api';
import { Recipe } from '@/contexts/FavoritesContext';
import { 
  Leaf, 
  Coffee, 
  Utensils, 
  Moon, 
  Cake, 
  Apple,
  Grid3X3,
  ChevronRight
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  diet?: string;
  type?: string;
  color: string;
  gradient: string;
}

const categories: Category[] = [
  {
    id: 'vegetarian',
    name: 'Vegetarian',
    description: 'Resep nabati tanpa daging',
    icon: Leaf,
    diet: 'vegetarian',
    color: 'text-green-600',
    gradient: 'from-green-400 to-emerald-500'
  },
  {
    id: 'vegan',
    name: 'Vegan',
    description: 'Resep sepenuhnya dari tumbuhan',
    icon: Apple,
    diet: 'vegan',
    color: 'text-emerald-600',
    gradient: 'from-emerald-400 to-green-500'
  },
  {
    id: 'breakfast',
    name: 'Sarapan',
    description: 'Mulai hari dengan resep-resep ini',
    icon: Coffee,
    type: 'breakfast',
    color: 'text-amber-600',
    gradient: 'from-amber-400 to-orange-500'
  },
  {
    id: 'lunch',
    name: 'Makan Siang',
    description: 'Hidangan sempurna untuk siang hari',
    icon: Utensils,
    type: 'lunch',
    color: 'text-blue-600',
    gradient: 'from-blue-400 to-indigo-500'
  },
  {
    id: 'dinner',
    name: 'Makan Malam',
    description: 'Hidangan hangat untuk malam hari',
    icon: Moon,
    type: 'dinner',
    color: 'text-purple-600',
    gradient: 'from-purple-400 to-violet-500'
  },
  {
    id: 'dessert',
    name: 'Pencuci Mulut',
    description: 'Makanan manis dan dessert',
    icon: Cake,
    type: 'dessert',
    color: 'text-pink-600',
    gradient: 'from-pink-400 to-rose-500'
  },
  {
    id: 'keto',
    name: 'Keto',
    description: 'Resep ketogenik rendah karbohidrat',
    icon: Utensils,
    diet: 'ketogenic',
    color: 'text-red-600',
    gradient: 'from-red-400 to-pink-500'
  },
  {
    id: 'gluten-free',
    name: 'Bebas Gluten',
    description: 'Resep tanpa gluten',
    icon: Leaf,
    diet: 'gluten free',
    color: 'text-teal-600',
    gradient: 'from-teal-400 to-cyan-500'
  }
];

const Categories: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCategoryRecipes = async (category: Category) => {
    setLoading(true);
    setSelectedCategory(category);
    
    try {
      const response = await getRecipesByCategory(
        category.diet || '',
        category.type,
        12
      );
      setRecipes(response.results);
      toast({
        title: `${category.name} Recipes Loaded`,
        description: `Found ${response.totalResults} recipes`
      });
    } catch (error) {
      console.warn('Failed to load category recipes, using dummy data:', error);
      
      // Filter dummy data based on category
      let filtered = dummyRecipes.results;
      
      // Simple filtering logic for demo
      if (category.type === 'dessert') {
        filtered = [dummyRecipes.results[4]]; // Chocolate Lava Cake
      } else if (category.diet === 'vegetarian') {
        filtered = [dummyRecipes.results[1], dummyRecipes.results[3], dummyRecipes.results[5]]; // Risotto, Caesar Salad, Quinoa Bowl
      } else {
        filtered = dummyRecipes.results.slice(0, 4);
      }
      
      setRecipes(filtered);
      toast({
        title: `Demo ${category.name} Recipes`,
        description: "Using sample data for demonstration"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-warm bg-clip-text text-transparent flex items-center justify-center">
              <Grid3X3 className="mr-3 h-10 w-10 text-primary" />
              Recipe Categories
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore recipes by dietary preferences, meal types, and special occasions
          </p>
        </div>

        {!selectedCategory ? (
          /* Categories Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card
                  key={category.id}
                  className="group cursor-pointer hover:shadow-card transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50 overflow-hidden"
                  onClick={() => loadCategoryRecipes(category)}
                >
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className={`bg-gradient-to-r ${category.gradient} p-4 rounded-xl mb-4 mx-auto w-16 h-16 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-center text-primary group-hover:text-primary-glow transition-colors">
                        <span className="text-sm font-medium">Jelajahi Resep</span>
                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Selected Category Recipes */
          <div>
            {/* Category Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className={`bg-gradient-to-r ${selectedCategory.gradient} p-3 rounded-xl`}>
                  <selectedCategory.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{selectedCategory.name} Resep</h2>
                  <p className="text-muted-foreground">{selectedCategory.description}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCategory(null);
                  setRecipes([]);
                }}
              >
                Kembali ke Kategori
              </Button>
            </div>

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

            {/* Recipes Grid */}
            {!loading && recipes.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && recipes.length === 0 && (
              <div className="text-center py-12">
                <selectedCategory.icon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No {selectedCategory.name} recipes found</h3>
                <p className="text-muted-foreground mb-6">
                  Try exploring other categories or search for specific recipes
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => setSelectedCategory(null)}>
                    Telusuri Kategori
                  </Button>
                  <Link to="/search">
                    <Button variant="outline">
                      Cari Resep
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* More Recipes Button */}
            {!loading && recipes.length > 0 && (
              <div className="text-center mt-12">
                <Link to={`/search?${selectedCategory.diet ? `diet=${selectedCategory.diet}` : `type=${selectedCategory.type}`}`}>
                  <Button size="lg" variant="outline">
                    Lihat Semua Resep {selectedCategory.name}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        {!selectedCategory && (
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-semibold mb-6">Aksi Cepat</h3>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/search?diet=vegetarian">
                <Button variant="outline">Telusuri Vegetarian</Button>
              </Link>
              <Link to="/search?type=breakfast">
                <Button variant="outline">Ide Sarapan</Button>
              </Link>
              <Link to="/search?diet=gluten-free">
                <Button variant="outline">Opsi Bebas Gluten</Button>
              </Link>
              <Link to="/search">
                <Button>Cari Semua Resep</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;