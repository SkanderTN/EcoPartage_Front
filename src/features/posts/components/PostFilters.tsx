import React from 'react';

import { Input } from '../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { PostType, PostCondition, PostStatus, FilterPostDto } from '../types/post.types';
import { X } from 'lucide-react';

interface PostFiltersProps {
  filters: FilterPostDto;
  onFilterChange: (filters: Partial<FilterPostDto>) => void;
}

export const PostFilters: React.FC<PostFiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-3 ">
      {/* Type Filter */}
      <Select
        value={filters.type || ''}
        onValueChange={(value) => onFilterChange({ type: value as PostType || undefined })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Type d'annonce" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={PostType.FREE}>Gratuit</SelectItem>
          <SelectItem value={PostType.PAID}>Payant</SelectItem>
        </SelectContent>
      </Select>

      {/* Condition Filter */}
      <Select
        value={filters.condition || ''}
        onValueChange={(value) => onFilterChange({ condition: value as PostCondition || undefined })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="État" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={PostCondition.NEW}>Neuf</SelectItem>
          <SelectItem value={PostCondition.LIKE_NEW}>Comme neuf</SelectItem>
          <SelectItem value={PostCondition.USED}>Utilisé</SelectItem>
          <SelectItem value={PostCondition.DAMAGED}>Endommagé</SelectItem>
          <SelectItem value={PostCondition.EXPIRED}>Expiré</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select
        value={filters.status || ''}
        onValueChange={(value) => onFilterChange({ status: value as PostStatus || undefined })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={PostStatus.AVAILABLE}>Disponible</SelectItem>
          <SelectItem value={PostStatus.RESERVED}>Réservé</SelectItem>
          <SelectItem value={PostStatus.COMPLETED}>Complété</SelectItem>
          <SelectItem value={PostStatus.CANCELLED}>Annulé</SelectItem>
        </SelectContent>
      </Select>

      {/* City Filter */}
      <Input
        type="text"
        placeholder="Ville"
        value={filters.city || ''}
        onChange={(e) => onFilterChange({ city: e.target.value || undefined })}
        className="w-[180px]"
      />

      {/* Neighborhood Filter */}
      <Input
        type="text"
        placeholder="Quartier"
        value={filters.neighborhood || ''}
        onChange={(e) => onFilterChange({ neighborhood: e.target.value || undefined })}
        className="w-[180px]"
      />

      {/* Price Range for Paid posts */}
      {filters.type === PostType.PAID && (
        <>
          <Input
            type="number"
            placeholder="Prix min"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-[120px]"
          />
          <Input
            type="number"
            placeholder="Prix max"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-[120px]"
          />
        </>
        
      )}
      <button
            onClick={() =>
              onFilterChange({
                type: undefined,
                condition: undefined,
                status: undefined,
                city: undefined,
                neighborhood: undefined,
                minPrice: undefined,
                maxPrice: undefined,
                categoryId: undefined,
              })
            }>
              <X className='w-4 h-4'></X>
          </button>
    </div>
  );
};
