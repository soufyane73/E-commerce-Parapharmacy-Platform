import { 
  Sparkles, 
  Heart, 
  Waves, 
  Pill, 
  Droplets, 
  Palette, 
  Baby, 
  Sun 
} from "lucide-react";
import { Category } from "../types/product";
import { Button } from "./ui/button";

interface CategoryNavProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const iconMap: Record<string, any> = {
  Sparkles,
  Heart,
  Waves,
  Pill,
  Droplets,
  Palette,
  Baby,
  Sun,
};

export function CategoryNav({ categories, selectedCategory, onCategorySelect }: CategoryNavProps) {
  return (
    <nav className="bg-white border-b sticky top-[137px] md:top-[105px] z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => onCategorySelect(null)}
            className={`whitespace-nowrap ${selectedCategory === null ? 'bg-[#0288D1] hover:bg-[#01579B]' : 'border-[#0288D1]/30 text-gray-700 hover:bg-[#0288D1]/10'}`}
          >
            Tous les produits
          </Button>
          {categories.map((category) => {
            const Icon = iconMap[category.icon];
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => onCategorySelect(category.id)}
                className={`whitespace-nowrap gap-2 ${selectedCategory === category.id ? 'bg-[#0288D1] hover:bg-[#01579B]' : 'border-[#0288D1]/30 text-gray-700 hover:bg-[#0288D1]/10'}`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  );
}