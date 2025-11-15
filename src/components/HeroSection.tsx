import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-[#00BCD4]/10 via-[#0288D1]/10 to-[#01579B]/10 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl mb-4">
            Excellence Parapharmacie - Votre partenaire santé
          </h2>
          <p className="text-gray-600 mb-8">
            Des milliers de produits de santé, beauté et bien-être livrés rapidement à votre domicile.
            Conseils d'experts et livraison gratuite dès 49€.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="gap-2 bg-[#0288D1] hover:bg-[#01579B]">
              Découvrir nos produits
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="border-[#0288D1] text-[#0288D1] hover:bg-[#0288D1]/10">
              Nos conseils santé
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}