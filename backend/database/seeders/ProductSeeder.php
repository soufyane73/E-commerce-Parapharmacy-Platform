<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all()->keyBy('slug');

        $products = [
            [
                'name' => 'Sérum Vitamine C Anti-Âge',
                'description' => "Sérum concentré en vitamine C pure pour illuminer et unifier le teint. Formule anti-oxydante qui réduit les signes de l'âge.",
                'price' => 29.99,
                'original_price' => 39.99,
                'image' => 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHByb2R1Y3R8ZW58MXx8fHwxNzYyODAyNzc3fDA&ixlib=rb-4.1.0&q=80&w=1080',
                'category' => 'soins-visage',
                'brand' => 'DermaLux',
                'rating' => 4.5,
                'reviews_count' => 234,
                'in_stock' => true,
                'tags' => ['Anti-âge', 'Vitamine C', 'Bio'],
            ],
            [
                'name' => 'Complexe Multivitaminé Premium',
                'description' => 'Formule complète de vitamines et minéraux essentiels pour soutenir votre vitalité au quotidien. 30 gélules.',
                'price' => 24.90,
                'original_price' => null,
                'image' => 'https://images.unsplash.com/photo-1683394541762-f96c0d03dc38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXRhbWluJTIwc3VwcGxlbWVudHN8ZW58MXx8fHwxNzYyODQxNzE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
                'category' => 'vitamines',
                'brand' => 'VitaPlus',
                'rating' => 4.7,
                'reviews_count' => 456,
                'in_stock' => true,
                'tags' => ['Vitalité', 'Immunité'],
            ],
            [
                'name' => 'Crème Hydratante Naturelle',
                'description' => 'Crème onctueuse aux extraits naturels pour une hydratation 24h. Convient à tous types de peaux.',
                'price' => 19.99,
                'original_price' => 25.99,
                'image' => 'https://images.unsplash.com/photo-1614267861476-0d129972a0f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwY29zbWV0aWNzfGVufDF8fHx8MTc2Mjg0MTcxN3ww&ixlib=rb-4.1.0&q=80&w=1080',
                'category' => 'soins-visage',
                'brand' => 'NaturaDerm',
                'rating' => 4.3,
                'reviews_count' => 189,
                'in_stock' => true,
                'tags' => ['Bio', 'Végane', 'Hydratant'],
            ],
            [
                'name' => 'Kit Premiers Soins Familial',
                'description' => 'Trousse complète de premiers secours avec pansements, désinfectant et accessoires essentiels.',
                'price' => 34.90,
                'original_price' => null,
                'image' => 'https://images.unsplash.com/photo-1610552059579-ba4fab239eaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwcHJvZHVjdHN8ZW58MXx8fHwxNzYyODE1NjM3fDA&ixlib=rb-4.1.0&q=80&w=1080',
                'category' => 'hygiene',
                'brand' => 'MediCare',
                'rating' => 4.8,
                'reviews_count' => 567,
                'in_stock' => true,
                'tags' => ['Essentiel', 'Famille'],
            ],
            [
                'name' => 'Baume Corps Nourrissant',
                'description' => 'Baume riche et réparateur pour peaux très sèches. Texture fondante non grasse. Format 200ml.',
                'price' => 16.50,
                'original_price' => null,
                'image' => 'https://images.unsplash.com/photo-1608068811588-3a67006b7489?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBjcmVhbXxlbnwxfHx8fDE3NjI3ODE5NjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
                'category' => 'soins-corps',
                'brand' => 'BodyCare',
                'rating' => 4.6,
                'reviews_count' => 312,
                'in_stock' => true,
                'tags' => ['Hydratant', 'Peaux sèches'],
            ],
            [
                'name' => 'Huile Essentielle Lavande Bio',
                'description' => 'Huile essentielle 100% pure et naturelle pour relaxation et bien-être. Flacon 10ml.',
                'price' => 12.90,
                'original_price' => null,
                'image' => 'https://images.unsplash.com/photo-1611072965169-e1534f6f300c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMHdlbGxuZXNzfGVufDF8fHx8MTc2Mjg0MTcxN3ww&ixlib=rb-4.1.0&q=80&w=1080',
                'category' => 'soins-corps',
                'brand' => 'AromaPlus',
                'rating' => 4.9,
                'reviews_count' => 423,
                'in_stock' => true,
                'tags' => ['Bio', 'Relaxation', 'Aromathérapie'],
            ],
            [
                'name' => 'Shampooing Fortifiant Cheveux',
                'description' => 'Shampooing enrichi en kératine pour renforcer et revitaliser les cheveux fragiles. 250ml.',
                'price' => 14.99,
                'original_price' => null,
                'image' => 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHByb2R1Y3R8ZW58MXx8fHwxNzYyODAyNzc3fDA&ixlib=rb-4.1.0&q=80&w=1080',
                'category' => 'cheveux',
                'brand' => 'HairPro',
                'rating' => 4.4,
                'reviews_count' => 278,
                'in_stock' => true,
                'tags' => ['Fortifiant', 'Kératine'],
            ],
            [
                'name' => 'Probiotiques Digestion Plus',
                'description' => 'Complexe de probiotiques pour le confort digestif et l\'équilibre de la flore intestinale. 60 gélules.',
                'price' => 27.90,
                'original_price' => null,
                'image' => 'https://images.unsplash.com/photo-1683394541762-f96c0d03dc38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXRhbWluJTIwc3VwcGxlbWVudHN8ZW58MXx8fHwxNzYyODQxNzE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
                'category' => 'vitamines',
                'brand' => 'BioDigest',
                'rating' => 4.6,
                'reviews_count' => 192,
                'in_stock' => true,
                'tags' => ['Probiotiques', 'Digestion'],
            ],
            [
                'name' => 'Crème Solaire SPF 50+',
                'description' => 'Protection solaire haute pour visage et corps. Résistante à l\'eau. Texture légère non collante.',
                'price' => 18.90,
                'original_price' => 22.90,
                'image' => 'https://images.unsplash.com/photo-1614267861476-0d129972a0f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwY29zbWV0aWNzfGVufDF8fHx8MTc2Mjg0MTcxN3ww&ixlib=rb-4.1.0&q=80&w=1080',
                'category' => 'solaire',
                'brand' => 'SunProtect',
                'rating' => 4.7,
                'reviews_count' => 389,
                'in_stock' => true,
                'tags' => ['SPF 50+', 'Protection'],
            ],
            [
                'name' => 'Lingettes Bébé Douces',
                'description' => 'Lingettes ultra-douces sans parfum pour la peau délicate de bébé. Pack de 3x72 lingettes.',
                'price' => 9.99,
                'original_price' => null,
                'image' => 'https://images.unsplash.com/photo-1608068811588-3a67006b7489?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBjcmVhbXxlbnwxfHx8fDE3NjI3ODE5NjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
                'category' => 'bebe',
                'brand' => 'BabyLove',
                'rating' => 4.8,
                'reviews_count' => 521,
                'in_stock' => true,
                'tags' => ['Hypoallergénique', 'Sans parfum'],
            ],
            [
                'name' => 'Dentifrice Blancheur',
                'description' => 'Dentifrice formulé pour blanchir en douceur et protéger l\'émail. Goût menthe fraîche.',
                'price' => 7.50,
                'original_price' => null,
                'image' => 'https://images.unsplash.com/photo-1611072965169-e1534f6f300c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMHdlbGxuZXNzfGVufDF8fHx8MTc2Mjg0MTcxN3ww&ixlib=rb-4.1.0&q=80&w=1080',
                'category' => 'hygiene',
                'brand' => 'DentalCare',
                'rating' => 4.2,
                'reviews_count' => 145,
                'in_stock' => true,
                'tags' => ['Blancheur', 'Protection'],
            ],
            [
                'name' => 'Masque de Nuit Réparateur',
                'description' => 'Masque de nuit intensif pour régénérer la peau pendant le sommeil. Texture gel-crème.',
                'price' => 32.90,
                'original_price' => null,
                'image' => 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHByb2R1Y3R8ZW58MXx8fHwxNzYyODAyNzc3fDA&ixlib=rb-4.1.0&q=80&w=1080',
                'category' => 'soins-visage',
                'brand' => 'DermaLux',
                'rating' => 4.7,
                'reviews_count' => 267,
                'in_stock' => true,
                'tags' => ['Nuit', 'Anti-âge', 'Régénérant'],
            ],
        ];

        foreach ($products as $product) {
            $category = $categories->get($product['category']);
            if ($category) {
                Product::create([
                    'name' => $product['name'],
                    'description' => $product['description'],
                    'price' => $product['price'],
                    'original_price' => $product['original_price'],
                    'image' => $product['image'],
                    'category_id' => $category->id,
                    'brand' => $product['brand'],
                    'rating' => $product['rating'],
                    'reviews_count' => $product['reviews_count'],
                    'in_stock' => $product['in_stock'],
                    'tags' => $product['tags'],
                ]);
            }
        }
    }
}
