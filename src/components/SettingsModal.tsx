import { useState } from "react";
import { X, Bell, Globe, Lock, CreditCard, Truck, Mail, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";
import { User } from "./AuthModal";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUpdateUser: (user: User) => void;
}

export function SettingsModal({ isOpen, onClose, user, onUpdateUser }: SettingsModalProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotionalEmails, setPromotionalEmails] = useState(false);
  const [language, setLanguage] = useState("fr");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveNotifications = () => {
    toast.success("Préférences de notifications enregistrées");
  };

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    toast.success("Mot de passe modifié avec succès");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSaveLanguage = () => {
    toast.success(language === "fr" ? "Langue mise à jour : Français" : "اللغة المحدثة: العربية");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#0288D1]">Paramètres</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="notifications" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="language">
              <Globe className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Langue</span>
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Sécurité</span>
            </TabsTrigger>
            <TabsTrigger value="payment">
              <CreditCard className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Paiement</span>
            </TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notifications</CardTitle>
                <CardDescription>
                  Gérez vos notifications par email et push
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications par email</Label>
                    <p className="text-sm text-gray-500">Recevoir des emails pour les mises à jour</p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications push</Label>
                    <p className="text-sm text-gray-500">Recevoir des notifications sur votre appareil</p>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mises à jour des commandes</Label>
                    <p className="text-sm text-gray-500">Statut de livraison et confirmations</p>
                  </div>
                  <Switch
                    checked={orderUpdates}
                    onCheckedChange={setOrderUpdates}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Emails promotionnels</Label>
                    <p className="text-sm text-gray-500">Offres spéciales et nouveautés</p>
                  </div>
                  <Switch
                    checked={promotionalEmails}
                    onCheckedChange={setPromotionalEmails}
                  />
                </div>

                <Button 
                  onClick={handleSaveNotifications}
                  className="w-full bg-[#0288D1] hover:bg-[#01579B]"
                >
                  Enregistrer les préférences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Language Tab */}
          <TabsContent value="language" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Langue et région</CardTitle>
                <CardDescription>
                  Choisissez votre langue préférée
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="language">Langue de l'interface</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">🇫🇷 Français</SelectItem>
                      <SelectItem value="ar">🇲🇦 العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm">
                        <strong>Fonctionnalité multilingue</strong>
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        La plateforme Excellence Parapharmacie supporte le français et l'arabe pour
                        offrir une meilleure expérience à tous nos clients marocains.
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleSaveLanguage}
                  className="w-full bg-[#0288D1] hover:bg-[#01579B]"
                >
                  Enregistrer la langue
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Changer le mot de passe</CardTitle>
                <CardDescription>
                  Assurez-vous que votre compte est sécurisé
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="oldPassword">Ancien mot de passe</Label>
                  <Input
                    id="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm">
                        <strong>Conseils de sécurité</strong>
                      </p>
                      <ul className="text-sm text-gray-600 mt-1 list-disc list-inside space-y-1">
                        <li>Utilisez au moins 8 caractères</li>
                        <li>Mélangez lettres, chiffres et symboles</li>
                        <li>Ne réutilisez pas vos anciens mots de passe</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleChangePassword}
                  className="w-full bg-[#0288D1] hover:bg-[#01579B]"
                >
                  Changer le mot de passe
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Authentification à deux facteurs</CardTitle>
                <CardDescription>
                  Sécurisez davantage votre compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Activer l'authentification 2FA</Label>
                    <p className="text-sm text-gray-500">
                      Nécessite une vérification supplémentaire à la connexion
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Méthodes de paiement</CardTitle>
                <CardDescription>
                  Gérez vos options de paiement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Cash à la livraison</p>
                        <p className="text-sm text-gray-500">Paiement en espèces</p>
                      </div>
                    </div>
                    <span className="text-sm text-green-600">Disponible</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Carte bancaire</p>
                        <p className="text-sm text-gray-500">Visa, Mastercard</p>
                      </div>
                    </div>
                    <span className="text-sm text-green-600">Disponible</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">PayPal</p>
                        <p className="text-sm text-gray-500">Paiement en ligne</p>
                      </div>
                    </div>
                    <span className="text-sm text-green-600">Disponible</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Ajouter une carte bancaire
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Options de livraison</CardTitle>
                <CardDescription>
                  Vos partenaires de livraison
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Truck className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Amana</p>
                    <p className="text-sm text-gray-500">2-3 jours ouvrables</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Truck className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Cash Plus</p>
                    <p className="text-sm text-gray-500">2-3 jours ouvrables</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Truck className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Glovo</p>
                    <p className="text-sm text-gray-500">Livraison rapide (selon ville)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
