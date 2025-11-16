<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class GenerateJwtSecret extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'jwt:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate a secure JWT secret key';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $secret = base64_encode(random_bytes(64));
        
        $this->info('JWT Secret généré avec succès !');
        $this->line('');
        $this->line('Ajoutez cette ligne dans votre fichier .env :');
        $this->line('');
        $this->line("JWT_SECRET={$secret}");
        $this->line('');
        
        // Optionnel : mettre à jour automatiquement le .env
        if ($this->confirm('Voulez-vous mettre à jour automatiquement le fichier .env ?', true)) {
            $envPath = base_path('.env');
            
            if (File::exists($envPath)) {
                $envContent = File::get($envPath);
                
                // Remplacer ou ajouter JWT_SECRET
                if (preg_match('/^JWT_SECRET=.*/m', $envContent)) {
                    $envContent = preg_replace('/^JWT_SECRET=.*/m', "JWT_SECRET={$secret}", $envContent);
                } else {
                    $envContent .= "\nJWT_SECRET={$secret}\n";
                }
                
                File::put($envPath, $envContent);
                $this->info('Fichier .env mis à jour avec succès !');
            } else {
                $this->error('Fichier .env non trouvé. Créez-le d\'abord avec: cp .env.example .env');
            }
        }
        
        return Command::SUCCESS;
    }
}
