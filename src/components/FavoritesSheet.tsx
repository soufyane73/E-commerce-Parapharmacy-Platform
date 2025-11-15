import { X, ShoppingCart, Trash2, Heart } from "lucide-react";
import { Product } from "../types/product";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface FavoritesSheetProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Product[];
  onRemoveFavorite: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export function FavoritesSheet({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onAddToCart,
  onProductClick,
}: FavoritesSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
            Mes Favoris ({favorites.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Heart className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2">Aucun favori pour le moment</p>
              <p className="text-sm text-gray-400 mb-4">
                Ajoutez des produits à vos favoris pour les retrouver facilement
              </p>
              <Button onClick={onClose}>Découvrir nos produits</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.map((product) => (
                <div key={product.id} className="flex gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div 
                    className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 cursor-pointer"
                    onClick={() => {
                      onProductClick(product);
                      onClose();
                    }}
                  >
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => {
                          onProductClick(product);
                          onClose();
                        }}
                      >
                        <h4 className="text-sm line-clamp-2 mb-1">{product.name}</h4>
                        <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 flex-shrink-0"
                        onClick={() => onRemoveFavorite(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-emerald-600">
                          {product.price.toFixed(2)} €
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            {product.originalPrice.toFixed(2)} €
                          </span>
                        )}
                      </div>
                      
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => {
                          onAddToCart(product);
                        }}
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className="h-3 w-3" />
                        {product.inStock ? "Ajouter" : "Rupture"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {favorites.length > 0 && (
          <>
            <Separator />
            <div className="py-4">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-600">Total des favoris</span>
                <span>{favorites.length} produit{favorites.length > 1 ? "s" : ""}</span>
              </div>
              <Button 
                className="w-full gap-2" 
                size="lg"
                variant="outline"
                onClick={() => {
                  favorites.forEach(product => {
                    if (product.inStock) {
                      onAddToCart(product);
                    }
                  });
                }}
              >
                <ShoppingCart className="h-4 w-4" />
                Tout ajouter au panier
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
