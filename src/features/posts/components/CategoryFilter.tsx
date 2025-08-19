import React from 'react';
import { Badge } from '../../../components/ui/badge';
import { useCategories } from '../hooks/useCategories';
import { 
  Utensils, 
  Shirt, 
  Laptop, 
  Sofa, 
  Hammer, 
  BookOpen, 
  Gamepad2, 
  Dumbbell, 
  Flower,
  Package,
  X
} from 'lucide-react';
import { Category } from '../types/post.types';

interface CategoryFilterProps {
  selectedCategoryId?: string;
  onCategoryChange: (categoryId?: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategoryId, onCategoryChange }) => {
  const { data: categories, isLoading } = useCategories();

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('alimentation') || name.includes('nourriture')) return Utensils;
    if (name.includes('vêtement') || name.includes('mode')) return Shirt;
    if (name.includes('électronique') || name.includes('technologie')) return Laptop;
    if (name.includes('mobilier') || name.includes('meuble')) return Sofa;
    if (name.includes('matériaux') || name.includes('bricolage')) return Hammer;
    if (name.includes('livre') || name.includes('magazine')) return BookOpen;
    if (name.includes('jouet') || name.includes('jeu')) return Gamepad2;
    if (name.includes('sport') || name.includes('équipement')) return Dumbbell;
    if (name.includes('jardinage') || name.includes('plante')) return Flower;
    return Package; // default icon
  };

  if (isLoading) {
    return (
      <div className="flex gap-2 flex-wrap">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Catégories</h3>
      <div className="flex gap-2 flex-wrap">
        {/* All categories button */}
        <Badge
          variant={!selectedCategoryId ? "default" : "outline"}
          className={`cursor-pointer transition-colors flex items-center gap-1 ${
            !selectedCategoryId 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'hover:bg-gray-100'
          }`}
          onClick={() => onCategoryChange(undefined)}
        >
          <Package className="w-3 h-3" />
          Toutes
        </Badge>

        {/* Sort categories to put "Autre" at the end */}
        {categories?.slice().sort((a, b) => {
          if (a.name.toLowerCase() === 'autre') return 1;
          if (b.name.toLowerCase() === 'autre') return -1;
          return 0;
        }).map((category: Category) => {
          const IconComponent = getCategoryIcon(category.name);
          const isSelected = selectedCategoryId === category.id;
          
          return (
            <Badge
              key={category.id}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-colors flex items-center gap-1 ${
                isSelected 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => onCategoryChange(category.id)}
            >
              <IconComponent className="w-3 h-3" />
              {category.name}
            </Badge>
          );
        })}

        {/* Clear button */}
        {selectedCategoryId && (
          <Badge
            variant="outline"
            className="cursor-pointer transition-colors flex items-center gap-1 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
            onClick={() => onCategoryChange(undefined)}
          >
            <X className="w-3 h-3" />
            Effacer
          </Badge>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;