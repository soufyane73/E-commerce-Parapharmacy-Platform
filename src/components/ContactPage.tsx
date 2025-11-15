import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous pouvez ajouter la logique pour envoyer le message via Supabase
    toast.success("Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0288D1] to-[#00BCD4] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl mb-4">Contactez-nous</h1>
            <p className="text-white/90">
              Notre équipe est à votre disposition pour répondre à toutes vos questions sur nos produits et services
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-[#0288D1]" />
                  Envoyez-nous un message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Votre nom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+212 6XX XXX XXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Ex: Question sur un produit"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Écrivez votre message ici..."
                      rows={6}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full md:w-auto gap-2">
                    <Send className="h-4 w-4" />
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations de contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-[#00BCD4]/10 p-2 rounded-lg">
                    <Phone className="h-5 w-5 text-[#0288D1]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p>+212 5XX XXX XXX</p>
                    <p className="text-sm text-gray-500 mt-1">Lun-Sam: 9h-19h</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-[#00BCD4]/10 p-2 rounded-lg">
                    <Mail className="h-5 w-5 text-[#0288D1]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>contact@excellence-pharma.ma</p>
                    <p className="text-sm text-gray-500 mt-1">Réponse sous 24h</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-[#00BCD4]/10 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-[#0288D1]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Adresse</p>
                    <p>Avenue Hassan II</p>
                    <p>Casablanca, Maroc</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#0288D1]" />
                  Horaires d'ouverture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lundi - Vendredi</span>
                  <span>9h00 - 19h00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Samedi</span>
                  <span>9h00 - 17h00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dimanche</span>
                  <span className="text-red-500">Fermé</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#00BCD4]/10 border-[#0288D1]/30">
              <CardContent className="pt-6">
                <p className="text-sm text-[#01579B]">
                  <strong>Besoin d'aide urgente ?</strong>
                  <br />
                  Notre service client est disponible du lundi au samedi pour répondre à toutes vos questions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-6xl mx-auto mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Questions fréquentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="mb-2">Comment passer une commande ?</h3>
                  <p className="text-sm text-gray-600">
                    Parcourez notre catalogue, ajoutez les produits à votre panier et suivez les étapes de commande. Vous pouvez payer à la livraison ou en ligne.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2">Quels sont les délais de livraison ?</h3>
                  <p className="text-sm text-gray-600">
                    La livraison se fait sous 24 à 48h dans les grandes villes (Casablanca, Rabat, Fès, Tanger). Pour les autres villes, comptez 3 à 5 jours.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2">Puis-je retourner un produit ?</h3>
                  <p className="text-sm text-gray-600">
                    Oui, vous disposez de 14 jours pour retourner un produit non ouvert. Consultez notre politique de retour pour plus de détails.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2">Les produits sont-ils authentiques ?</h3>
                  <p className="text-sm text-gray-600">
                    Tous nos produits proviennent directement des laboratoires officiels et sont 100% authentiques et certifiés.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Locations */}
        <div className="max-w-6xl mx-auto mt-12">
          <h2 className="mb-6 text-center">Nos points de vente</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-2">Casablanca</h3>
                <p className="text-sm text-gray-600 mb-2">Avenue Hassan II, Casablanca</p>
                <p className="text-sm text-[#0288D1]">+212 5XX XXX XXX</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-2">Rabat</h3>
                <p className="text-sm text-gray-600 mb-2">Boulevard Mohammed V, Rabat</p>
                <p className="text-sm text-[#0288D1]">+212 5XX XXX XXX</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-2">Fès</h3>
                <p className="text-sm text-gray-600 mb-2">Avenue des Almohades, Fès</p>
                <p className="text-sm text-[#0288D1]">+212 5XX XXX XXX</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}