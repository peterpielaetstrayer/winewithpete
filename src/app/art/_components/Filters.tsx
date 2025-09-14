'use client';

import { Button } from '@/components/ui/button';

interface FiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  availableTags: string[];
}

export function Filters({ activeFilter, onFilterChange, availableTags }: FiltersProps) {
  const allFilters = ['All', ...availableTags];

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {allFilters.map((filter) => (
        <Button
          key={filter}
          variant={activeFilter === filter ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter)}
          className={`transition-all duration-200 ${
            activeFilter === filter
              ? 'bg-ember text-white hover:bg-ember-light shadow-md'
              : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50 hover:border-stone-400'
          }`}
        >
          {filter}
        </Button>
      ))}
    </div>
  );
}
