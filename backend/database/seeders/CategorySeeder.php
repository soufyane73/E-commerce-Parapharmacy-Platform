<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Soins du visage', 'icon' => 'Sparkles'],
            ['name' => 'Soins du corps', 'icon' => 'Heart'],
            ['name' => 'Cheveux', 'icon' => 'Waves'],
            ['name' => 'Vitamines & Compléments', 'icon' => 'Pill'],
            ['name' => 'Hygiène', 'icon' => 'Droplets'],
            ['name' => 'Maquillage', 'icon' => 'Palette'],
            ['name' => 'Bébé & Maman', 'icon' => 'Baby'],
            ['name' => 'Solaire', 'icon' => 'Sun'],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'icon' => $category['icon'],
                'description' => null,
            ]);
        }
    }
}
