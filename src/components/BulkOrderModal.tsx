import { useState } from "react";
import { X, Plus, Trash2, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";
import { products } from "../data/products";

interface BulkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: BulkOrder) => void;
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface BulkOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  notes: string;
  paymentMethod: string;
  deliveryMethod: string;
}

export function BulkOrderModal({ isOpen, onClose, onSubmit }: BulkOrderModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [deliveryMethod, setDeliveryMethod] = useState("amana");
  const [discount, setDiscount] = useState(0);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProductSearch, setShowProductSearch] = useState(false);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const existingItem = orderItems.find((item) => item.productId === productId);
    if (existingItem) {
      setOrderItems(
        orderItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        )
      );
    } else {
      setOrderItems([
        ...orderItems,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          price: product.price,
          total: product.price,
        },
      ]);
    }
    setSearchQuery("");
    setShowProductSearch(false);
    toast.success(`${product.name} ajouté`);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeProduct(productId);
      return;
    }
    setOrderItems(
      orderItems.map((item) =>
        item.productId === productId ? { ...item, quantity, total: quantity * item.price } : item
      )
    );
  };

  const removeProduct = (productId: string) => {
    setOrderItems(orderItems.filter((item) => item.productId !== productId));
  };

  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal - discount;

  const handleSubmit = () => {
    if (!customerName || !customerEmail || !customerPhone || !customerAddress) {
      toast.error("Veuillez remplir toutes les informations client");
      return;
    }

    if (orderItems.length === 0) {
      toast.error("Veuillez ajouter au moins un produit");
      return;
    }

    const order: BulkOrder = {
      id: `CMD-${Date.now()}`,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      items: orderItems,
      subtotal,
      discount,
      total,
      notes,
      paymentMethod,
      deliveryMethod,
    };

    onSubmit(order);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setCustomerAddress("");
    setNotes("");
    setPaymentMethod("cash");
    setDeliveryMethod("amana");
    setDiscount(0);
    setOrderItems([]);
    setSearchQuery("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#0288D1]">Nouvelle commande en gros</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informations client */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Informations client</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Nom complet *</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ahmed El Fassi"
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Email *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="ahmed@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Téléphone *</Label>
                  <Input
                    id="customerPhone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+212 6XX XXX XXX"
                  />
                </div>
                <div>
                  <Label htmlFor="customerAddress">Adresse *</Label>
                  <Input
                    id="customerAddress"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Casablanca, Maroc"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Produits */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Produits</h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 border-[#0288D1] text-[#0288D1] hover:bg-[#0288D1] hover:text-white"
                  onClick={() => setShowProductSearch(!showProductSearch)}
                >
                  <Plus className="h-4 w-4" />
                  Ajouter produit
                </Button>
              </div>

              {showProductSearch && (
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher un produit..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {searchQuery && (
                    <div className="mt-2 border rounded-lg max-h-48 overflow-y-auto">
                      {filteredProducts.slice(0, 5).map((product) => (
                        <button
                          key={product.id}
                          onClick={() => addProduct(product.id)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between border-b last:border-b-0"
                        >
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.brand}</p>
                          </div>
                          <Badge variant="outline">{product.price} DH</Badge>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                {orderItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Aucun produit ajouté</p>
                  </div>
                ) : (
                  orderItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-4 p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.productName}</p>
                        <p className="text-xs text-gray-500">{item.price} DH / unité</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.productId, parseInt(e.target.value) || 0)
                          }
                          className="w-16 h-8 text-center"
                          min="1"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <div className="w-24 text-right font-medium">{item.total.toFixed(2)} DH</div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeProduct(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              {orderItems.length > 0 && (
                <div className="mt-4 pt-4 border-t space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-medium">{subtotal.toFixed(2)} DH</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Remise</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                        className="w-24 h-8 text-right"
                        min="0"
                        max={subtotal}
                      />
                      <span>DH</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-lg pt-2 border-t">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold text-[#0288D1]">{total.toFixed(2)} DH</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Méthodes de paiement et livraison */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paymentMethod">Méthode de paiement</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash à la livraison</SelectItem>
                  <SelectItem value="card">Carte bancaire</SelectItem>
                  <SelectItem value="transfer">Virement bancaire</SelectItem>
                  <SelectItem value="check">Chèque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="deliveryMethod">Méthode de livraison</Label>
              <Select value={deliveryMethod} onValueChange={setDeliveryMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amana">Amana</SelectItem>
                  <SelectItem value="cashplus">Cash Plus</SelectItem>
                  <SelectItem value="glovo">Glovo</SelectItem>
                  <SelectItem value="own">Livraison propre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informations supplémentaires..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-[#0288D1] hover:bg-[#01579B]"
            disabled={orderItems.length === 0}
          >
            Créer la commande
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { Package } from "lucide-react";
