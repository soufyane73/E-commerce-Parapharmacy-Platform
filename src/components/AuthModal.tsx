import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { User, Building2, Mail, Lock, Phone, MapPin, FileText } from "lucide-react";
import { toast } from "sonner";
import { apiService } from "../services/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export interface User {
  id: string;
  email: string;
  name: string;
  type: "b2c" | "b2b";
  phone?: string;
  address?: string;
  city?: string;
  // B2B specific
  companyName?: string;
  taxId?: string;
  licenseNumber?: string;
}

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [accountType, setAccountType] = useState<"b2c" | "b2b">("b2c");

  // Login form
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Register form
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    // B2B fields
    companyName: "",
    taxId: "",
    licenseNumber: "",
    pharmacyAddress: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.login(loginData.email, loginData.password);
      
      // Convert API user to our User type
      const user: User = {
        id: String(response.user.id),
        email: response.user.email,
        name: response.user.name,
        type: response.user.type,
        phone: response.user.phone,
        address: response.user.address,
        city: response.user.city,
        companyName: response.user.company_name,
        taxId: response.user.tax_id,
        licenseNumber: response.user.license_number,
      };

      toast.success("Connexion réussie !");
      onLogin(user);
      onClose();
      
      // Reset form
      setLoginData({ email: "", password: "" });
    } catch (error: any) {
      toast.error(error.message || "Email ou mot de passe incorrect");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (accountType === "b2c") {
      if (!registerData.email || !registerData.password || !registerData.firstName || !registerData.lastName || !registerData.phone) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }
    } else {
      if (!registerData.email || !registerData.password || !registerData.companyName || !registerData.taxId || !registerData.licenseNumber) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (registerData.password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.register({
        email: registerData.email,
        password: registerData.password,
        password_confirmation: registerData.confirmPassword,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        phone: registerData.phone,
        address: accountType === "b2c" ? registerData.address : registerData.pharmacyAddress,
        city: registerData.city,
        type: accountType,
        companyName: accountType === "b2b" ? registerData.companyName : undefined,
        taxId: accountType === "b2b" ? registerData.taxId : undefined,
        licenseNumber: accountType === "b2b" ? registerData.licenseNumber : undefined,
      });

      // Convert API user to our User type
      const user: User = {
        id: String(response.user.id),
        email: response.user.email,
        name: response.user.name,
        type: response.user.type,
        phone: response.user.phone,
        address: response.user.address,
        city: response.user.city,
        companyName: response.user.company_name,
        taxId: response.user.tax_id,
        licenseNumber: response.user.license_number,
      };

      toast.success("Inscription réussie ! Bienvenue sur PharmaPlus");
      onLogin(user);
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Connexion / Inscription</DialogTitle>
          <DialogDescription>
            Connectez-vous à votre compte ou inscrivez-vous pour accéder à nos services.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="votre@email.com"
                    className="pl-10"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <a href="#" className="text-emerald-600 hover:underline">
                  Mot de passe oublié ?
                </a>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>

              {/* Demo credentials */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
                <p className="text-xs text-gray-600">
                  <strong>Comptes de démonstration :</strong>
                </p>
                <div className="text-xs space-y-1">
                  <p className="text-gray-600">
                    <strong>B2C :</strong> sophia.martin@email.com / SophiaPass123!
                  </p>
                  <p className="text-gray-600">
                    <strong>B2B :</strong> pharmacy-alfarabi@example.ma / FarAbi2024!
                  </p>
                </div>
              </div>
            </form>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <div className="space-y-6">
              {/* Account Type Selection */}
              <div className="space-y-3">
                <Label>Type de compte</Label>
                <RadioGroup value={accountType} onValueChange={(v) => setAccountType(v as "b2c" | "b2b")}>
                  <Card className={accountType === "b2c" ? "border-emerald-600 border-2" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="b2c" id="b2c" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="h-5 w-5 text-emerald-600" />
                            <Label htmlFor="b2c" className="cursor-pointer">
                              Particulier (B2C)
                            </Label>
                          </div>
                          <p className="text-sm text-gray-500">
                            Pour vos achats personnels de produits de parapharmacie
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={accountType === "b2b" ? "border-emerald-600 border-2" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="b2b" id="b2b" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Building2 className="h-5 w-5 text-emerald-600" />
                            <Label htmlFor="b2b" className="cursor-pointer">
                              Professionnel - Pharmacie (B2B)
                            </Label>
                          </div>
                          <p className="text-sm text-gray-500">
                            Pour les pharmacies et professionnels de santé. Tarifs préférentiels et commandes en gros.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </RadioGroup>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleRegister} className="space-y-4">
                {accountType === "b2c" ? (
                  <>
                    {/* B2C Form */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom *</Label>
                        <Input
                          id="firstName"
                          value={registerData.firstName}
                          onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom *</Label>
                        <Input
                          id="lastName"
                          value={registerData.lastName}
                          onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="votre@email.com"
                          className="pl-10"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+212 6XX XXX XXX"
                          className="pl-10"
                          value={registerData.phone}
                          onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="address"
                          placeholder="Votre adresse"
                          className="pl-10"
                          value={registerData.address}
                          onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city"
                        placeholder="Casablanca, Rabat, Fès..."
                        value={registerData.city}
                        onChange={(e) => setRegisterData({ ...registerData, city: e.target.value })}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* B2B Form */}
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nom de la pharmacie *</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="companyName"
                          placeholder="Pharmacie Al Farabi"
                          className="pl-10"
                          value={registerData.companyName}
                          onChange={(e) => setRegisterData({ ...registerData, companyName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taxId">Identifiant fiscal (ICE) *</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="taxId"
                          placeholder="000000000000000"
                          className="pl-10"
                          value={registerData.taxId}
                          onChange={(e) => setRegisterData({ ...registerData, taxId: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">Numéro de licence pharmacie *</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="licenseNumber"
                          placeholder="PH-XXXX-YYYY"
                          className="pl-10"
                          value={registerData.licenseNumber}
                          onChange={(e) => setRegisterData({ ...registerData, licenseNumber: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="b2b-email">Email professionnel *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="b2b-email"
                          type="email"
                          placeholder="contact@pharmacie.ma"
                          className="pl-10"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="b2b-phone">Téléphone professionnel *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="b2b-phone"
                          type="tel"
                          placeholder="+212 5XX XXX XXX"
                          className="pl-10"
                          value={registerData.phone}
                          onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pharmacyAddress">Adresse de la pharmacie *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="pharmacyAddress"
                          placeholder="Avenue Hassan II, Casablanca"
                          className="pl-10"
                          value={registerData.pharmacyAddress}
                          onChange={(e) => setRegisterData({ ...registerData, pharmacyAddress: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Common Password Fields */}
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Au moins 8 caractères"
                      className="pl-10"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Retapez votre mot de passe"
                      className="pl-10"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {accountType === "b2b" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note :</strong> Votre compte B2B sera validé sous 24-48h après vérification de vos documents. Vous recevrez un email de confirmation.
                    </p>
                  </div>
                )}

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Inscription..." : "Créer mon compte"}
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}