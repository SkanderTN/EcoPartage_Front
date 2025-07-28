import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '../../../components/ui/popover';
import { PostFilters } from './PostFilters';
import { FilterPostDto } from '../types/post.types';

interface PostSearchProps {
  onSearch: (query: string) => void;
  filters: FilterPostDto;
  onFilterChange: (filters: Partial<FilterPostDto>) => void;
  placeholder?: string;
}

export const PostSearch: React.FC<PostSearchProps> = ({
  onSearch,
  filters,
  onFilterChange,
  placeholder = 'Rechercher une annonce...'
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-2">
      <form 
        onSubmit={handleSubmit} 
        className="relative flex items-center w-full max-w-2xl"
      >
        <Search className="absolute left-3 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-24 h-12 text-base"
        />
        <Button
          type="submit"
          className="absolute right-1 h-9 px-4 bg-[#518581] text-white hover:bg-[#3e6c69]"
        >
          Rechercher
        </Button>
      </form>

      {/* Filtrer button with dropdown */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-12 px-4 border border-gray-300 text-gray-700"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtrer
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[340px] p-4 shadow-lg">
          <PostFilters filters={filters} onFilterChange={onFilterChange} />
        </PopoverContent>
      </Popover>
    </div>
  );
};
