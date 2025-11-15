import { ShoppingCart, Star, Check, X } from "lucide-react";
import { Product } from "../types/product";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discount > 0 && (
              <Badge className="absolute top-4 right-4 bg-red-500">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-2">
              <Badge variant="outline" className="text-emerald-600">
                {product.brand}
              </Badge>
            </div>
            
            <h2 className="mb-4">{product.name}</h2>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm">{product.rating}</span>
              <span className="text-sm text-gray-500">({product.reviews} avis)</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-emerald-600 text-2xl">{product.price.toFixed(2)} €</span>
              {product.originalPrice && (
                <span className="text-gray-400 line-through">
                  {product.originalPrice.toFixed(2)} €
                </span>
              )}
            </div>

            <div className={`flex items-center gap-2 mb-6 ${product.inStock ? "text-emerald-600" : "text-red-500"}`}>
              {product.inStock ? (
                <>
                  <Check className="h-5 w-5" />
                  <span>En stock - Livraison rapide</span>
                </>
              ) : (
                <>
                  <X className="h-5 w-5" />
                  <span>Rupture de stock</span>
                </>
              )}
            </div>

            <Separator className="mb-6" />

            <div className="mb-6">
              <h3 className="text-sm mb-2">Description</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm mb-2">Caractéristiques</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-sm">Quantité:</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button
                className="w-full gap-2"
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-5 w-5" />
                Ajouter au panier - {(product.price * quantity).toFixed(2)} €
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
