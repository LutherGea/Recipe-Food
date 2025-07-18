import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, diet?: string, type?: string) => void;
  loading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading = false }) => {
  const [query, setQuery] = useState('');
  const [diet, setDiet] = useState<string>('');
  const [type, setType] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, diet || undefined, type || undefined);
  };

  const dietOptions = [
    { value: '', label: 'All Diets' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten-free', label: 'Gluten Free' },
    { value: 'ketogenic', label: 'Keto' },
    { value: 'paleo', label: 'Paleo' },
    { value: 'whole30', label: 'Whole30' }
  ];

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'main course', label: 'Main Course' },
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'dessert', label: 'Dessert' },
    { value: 'appetizer', label: 'Appetizer' },
    { value: 'snack', label: 'Snack' },
    { value: 'drink', label: 'Drink' }
  ];

  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for recipes... (e.g., pasta, chicken, vegetarian)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center">
              <Filter className="h-4 w-4 mr-1" />
              Diet
            </label>
            <Select value={diet} onValueChange={setDiet}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select diet" />
              </SelectTrigger>
              <SelectContent>
                {dietOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Meal Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground opacity-0">Search</label>
            <Button 
              type="submit" 
              className="w-full h-10 bg-gradient-warm hover:opacity-90"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search Recipes'}
            </Button>
          </div>
        </div>

        {(query || diet || type) && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Filters active: {[
                query && `"${query}"`,
                diet && dietOptions.find(d => d.value === diet)?.label,
                type && typeOptions.find(t => t.value === type)?.label
              ].filter(Boolean).join(', ')}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery('');
                setDiet('');
                setType('');
                onSearch('');
              }}
            >
              Clear All
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;