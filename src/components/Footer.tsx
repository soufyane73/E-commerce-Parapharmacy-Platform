import { Heart, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "./Logo";

interface FooterProps {
  onNavigate?: (page: "home" | "contact") => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gradient-to-br from-[#01579B] to-[#0288D1] text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Logo className="h-8 w-8" />
              <span className="text-white">Excellence Parapharmacie</span>
            </div>
            <p className="text-sm text-white/80">
              Votre parapharmacie en ligne de confiance depuis 2020.
            </p>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white mb-4">Service Client</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Livraison</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Retours</a></li>
              <li>
                <button 
                  onClick={() => onNavigate?.("contact")} 
                  className="hover:text-white transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-white mb-4">À propos</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="#" className="hover:text-white transition-colors">Notre histoire</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Nos pharmaciens</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog santé</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Recrutement</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+212 5XX XXX XXX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contact@excellence-pharma.ma</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Avenue Hassan II<br />Casablanca, Maroc</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-sm text-center text-white/80">
          <p>© 2025 Excellence Parapharmacie. Tous droits réservés. | Mentions légales | Politique de confidentialité</p>
        </div>
      </div>
    </footer>
  );
}