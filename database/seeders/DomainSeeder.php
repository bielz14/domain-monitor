<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Domain;
use App\Models\User;

class DomainSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();

        $domains = [
            'https://google.com',
            'https://github.com',
            'https://stackoverflow.com',
            'https://example.com',
            'https://laravel.com',
        ];

        foreach ($domains as $url) {
            Domain::create([
                'user_id' => $user->id,
                'url' => $url,
                'check_interval' => rand(60, 300),
                'timeout' => rand(2, 10),
                'method' => ['GET', 'HEAD'][rand(0, 1)],
                'last_checked_at' => now(),
            ]);
        }
    }
}
