import axios from 'axios';

const API_KEY = 'd80c4ea7041749cebdb437429a3bedd4';
const BASE_URL = 'https://api.spoonacular.com/recipes';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    apiKey: API_KEY
  }
});

export interface RecipeSearchResult {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
}

export interface RecipeDetail {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  instructions: string;
  extendedIngredients: Array<{
    id: number;
    name: string;
    amount: number;
    unit: string;
  }>;
  nutrition: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
  };
}

// Search recipes with various filters
export const searchRecipes = async (
  query: string = '',
  diet?: string,
  type?: string,
  number: number = 12,
  offset: number = 0
) => {
  try {
    const response = await api.get('/complexSearch', {
      params: {
        query,
        diet,
        type,
        number,
        offset,
        addRecipeInformation: true,
        fillIngredients: true
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

// Get recipe details by ID
export const getRecipeById = async (id: number): Promise<RecipeDetail> => {
  try {
    const response = await api.get(`/${id}/information`, {
      params: {
        includeNutrition: true
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
};

// Get random recipes
export const getRandomRecipes = async (number: number = 1, tags?: string) => {
  try {
    const response = await api.get('/random', {
      params: {
        number,
        tags
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    throw error;
  }
};

// Get recipes by category/diet
export const getRecipesByCategory = async (
  diet: string,
  type?: string,
  number: number = 12
) => {
  try {
    const response = await api.get('/complexSearch', {
      params: {
        diet,
        type,
        number,
        addRecipeInformation: true,
        fillIngredients: true
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes by category:', error);
    throw error;
  }
};

// Dummy data fallback in case API fails
export const dummyRecipes = {
  results: [
    {
      id: 1,
      title: "Spicy Thai Basil Chicken",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300",
      readyInMinutes: 20,
      servings: 4,
      summary: "A delicious and aromatic Thai dish with fresh basil and spicy chilies."
    },
    {
      id: 2,
      title: "Creamy Mushroom Risotto",
      image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=300",
      readyInMinutes: 35,
      servings: 6,
      summary: "Rich and creamy risotto with wild mushrooms and parmesan cheese."
    },
    {
      id: 3,
      title: "Grilled Salmon with Herbs",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300",
      readyInMinutes: 25,
      servings: 2,
      summary: "Fresh Atlantic salmon grilled to perfection with aromatic herbs."
    },
    {
      id: 4,
      title: "Classic Caesar Salad",
      image: "https://images.unsplash.com/photo-1512852939750-1305098529bf?w=300",
      readyInMinutes: 15,
      servings: 4,
      summary: "Crisp romaine lettuce with homemade caesar dressing and croutons."
    },
    {
      id: 5,
      title: "Chocolate Lava Cake",
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300",
      readyInMinutes: 30,
      servings: 4,
      summary: "Decadent chocolate cake with a molten center, served warm."
    },
    {
      id: 6,
      title: "Mediterranean Quinoa Bowl",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300",
      readyInMinutes: 25,
      servings: 3,
      summary: "Healthy quinoa bowl with vegetables, feta cheese, and olive oil."
    }
  ],
  totalResults: 100
};