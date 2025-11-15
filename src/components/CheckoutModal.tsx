import { useState } from "react";
import { X, ChevronRight, CreditCard, Banknote, Wallet, Truck, Package, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { CartItem } from "../types/product";
import { toast } from "sonner@2.0.3";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  total: number;
  onOrderComplete: () => void;
}

type Step = "info" | "shipping" | "payment" | "confirmation";

export function CheckoutModal({ isOpen, onClose, cartItems, total, onOrderComplete }: CheckoutModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>("info");
  const [orderNumber, setOrderNumber] = useState("");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  const [shippingMethod, setShippingMethod] = useState("amana");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep = (step: Step): boolean => {
    if (step === "info") {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.city) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error("Veuillez entrer une adresse email valide");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    
    if (currentStep === "info") setCurrentStep("shipping");
    else if (currentStep === "shipping") setCurrentStep("payment");
    else if (currentStep === "payment") handleSubmitOrder();
  };

  const handleBack = () => {
    if (currentStep === "shipping") setCurrentStep("info");
    else if (currentStep === "payment") setCurrentStep("shipping");
  };

  const handleSubmitOrder = () => {
    // Générer un numéro de commande
    const orderNum = `MA${Date.now().toString().slice(-8)}`;
    setOrderNumber(orderNum);
    setCurrentStep("confirmation");
    
    toast.success("Commande validée avec succès !");
  };

  const handleFinish = () => {
    onOrderComplete();
    onClose();
    // Reset form
    setCurrentStep("info");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      notes: "",
    });
  };

  const shippingOptions = [
    { id: "amana", name: "Amana", price: 30, time: "24-48h", icon: Package },
    { id: "cashplus", name: "Cash Plus", price: 35, time: "24-48h", icon: Package },
    { id: "glovo", name: "Glovo", price: 40, time: "2-4h", icon: Truck },
    { id: "own", name: "Livraison PharmaPlus", price: 25, time: "24-72h", icon: Truck },
  ];

  const paymentOptions = [
    { id: "cash", name: "Paiement à la livraison", desc: "Payez en espèces lors de la réception", icon: Banknote },
    { id: "card", name: "Carte bancaire", desc: "Paiement sécurisé en ligne", icon: CreditCard },
    { id: "paypal", name: "PayPal", desc: "Paiement via votre compte PayPal", icon: Wallet },
  ];

  const selectedShipping = shippingOptions.find(opt => opt.id === shippingMethod);
  const shippingCost = selectedShipping?.price || 0;
  const finalTotal = total + shippingCost;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentStep === "confirmation" ? "Confirmation de commande" : "Finaliser ma commande"}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        {currentStep !== "confirmation" && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "info" ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-600"
              }`}>
                1
              </div>
              <span className="text-sm hidden sm:inline">Informations</span>
            </div>
            <ChevronRight className="text-gray-400" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "shipping" ? "bg-emerald-600 text-white" : 
                currentStep === "payment" ? "bg-emerald-100 text-emerald-600" : "bg-gray-200 text-gray-400"
              }`}>
                2
              </div>
              <span className="text-sm hidden sm:inline">Livraison</span>
            </div>
            <ChevronRight className="text-gray-400" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "payment" ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-400"
              }`}>
                3
              </div>
              <span className="text-sm hidden sm:inline">Paiement</span>
            </div>
          </div>
        )}

        {/* Step 1: Information */}
        {currentStep === "info" && (
          <div className="space-y-4">
            <h3 className="mb-4">Informations de livraison</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+212 6XX XXX XXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Adresse complète *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Ville *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Code postal</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes de livraison (optionnel)</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Ex: Livrer après 18h, Sonnette au 2ème étage..."
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Step 2: Shipping */}
        {currentStep === "shipping" && (
          <div className="space-y-4">
            <h3 className="mb-4">Mode de livraison</h3>
            <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
              {shippingOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Card key={option.id} className={shippingMethod === option.id ? "border-emerald-600 border-2" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Icon className="h-6 w-6 text-emerald-600" />
                        <div className="flex-1">
                          <Label htmlFor={option.id} className="cursor-pointer">
                            {option.name}
                          </Label>
                          <p className="text-sm text-gray-500">Délai: {option.time}</p>
                        </div>
                        <span className="text-emerald-600">{option.price} DH</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </RadioGroup>

            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <h4 className="mb-2">Adresse de livraison</h4>
                <p className="text-sm text-gray-600">
                  {formData.firstName} {formData.lastName}<br />
                  {formData.address}<br />
                  {formData.city} {formData.postalCode}<br />
                  {formData.phone}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Payment */}
        {currentStep === "payment" && (
          <div className="space-y-4">
            <h3 className="mb-4">Mode de paiement</h3>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              {paymentOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Card key={option.id} className={paymentMethod === option.id ? "border-emerald-600 border-2" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Icon className="h-6 w-6 text-emerald-600" />
                        <div className="flex-1">
                          <Label htmlFor={option.id} className="cursor-pointer">
                            {option.name}
                          </Label>
                          <p className="text-sm text-gray-500">{option.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </RadioGroup>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{total.toFixed(2)} DH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Livraison ({selectedShipping?.name})</span>
                <span>{shippingCost.toFixed(2)} DH</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Total à payer</span>
                <span className="text-emerald-600">{finalTotal.toFixed(2)} DH</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === "confirmation" && (
          <div className="text-center space-y-6 py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-emerald-600 mb-2">Commande validée !</h3>
              <p className="text-gray-600">Votre commande a été enregistrée avec succès</p>
            </div>
            
            <Card className="bg-gray-50">
              <CardContent className="p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Numéro de commande</span>
                  <span className="font-mono">{orderNumber}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Mode de paiement</span>
                  <span>{paymentOptions.find(p => p.id === paymentMethod)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span>{selectedShipping?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Délai estimé</span>
                  <span>{selectedShipping?.time}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Total payé</span>
                  <span className="text-emerald-600">{finalTotal.toFixed(2)} DH</span>
                </div>
              </CardContent>
            </Card>

            <p className="text-sm text-gray-500">
              Un email de confirmation a été envoyé à <strong>{formData.email}</strong>
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          {currentStep === "confirmation" ? (
            <Button onClick={handleFinish} className="w-full" size="lg">
              Terminer
            </Button>
          ) : (
            <>
              {currentStep !== "info" && (
                <Button onClick={handleBack} variant="outline" className="flex-1">
                  Retour
                </Button>
              )}
              <Button onClick={handleNext} className="flex-1" size="lg">
                {currentStep === "payment" ? "Confirmer la commande" : "Continuer"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
