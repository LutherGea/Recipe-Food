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
  const [diet, setDiet] = useState<string>('all');
  const [type, setType] = useState<string>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, diet === 'all' ? undefined : diet, type === 'all' ? undefined : type);
  };

  const dietOptions = [
    { value: 'all', label: 'Semua Diet' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten-free', label: 'Bebas Gluten' },
    { value: 'ketogenic', label: 'Keto' },
    { value: 'paleo', label: 'Paleo' },
    { value: 'whole30', label: 'Whole30' }
  ];

  const typeOptions = [
    { value: 'all', label: 'Semua Jenis' },
    { value: 'main course', label: 'Hidangan Utama' },
    { value: 'breakfast', label: 'Sarapan' },
    { value: 'lunch', label: 'Makan Siang' },
    { value: 'dinner', label: 'Makan Malam' },
    { value: 'dessert', label: 'Pencuci Mulut' },
    { value: 'appetizer', label: 'Pembuka' },
    { value: 'snack', label: 'Camilan' },
    { value: 'drink', label: 'Minuman' }
  ];

  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Cari resep... (contoh: pasta, ayam, vegetarian)"
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
                <SelectValue placeholder="Pilih diet" />
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
            <label className="text-sm font-medium text-foreground">Jenis Makanan</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Pilih jenis" />
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
            <label className="text-sm font-medium text-foreground opacity-0">Cari</label>
            <Button 
              type="submit" 
              className="w-full h-10 bg-gradient-warm hover:opacity-90"
              disabled={loading}
            >
              {loading ? 'Mencari...' : 'Cari Resep'}
            </Button>
          </div>
        </div>

        {(query || (diet && diet !== 'all') || (type && type !== 'all')) && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Filter aktif: {[
                query && `"${query}"`,
                diet && diet !== 'all' && dietOptions.find(d => d.value === diet)?.label,
                type && type !== 'all' && typeOptions.find(t => t.value === type)?.label
              ].filter(Boolean).join(', ')}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery('');
                setDiet('all');
                setType('all');
                onSearch('');
              }}
            >
              Hapus Semua
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;