<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Check;
use App\Models\Domain;

class CheckSeeder extends Seeder
{
    public function run(): void
    {
        $domains = Domain::all();

        foreach ($domains as $domain) {

            // 50 перевірок на домен
            for ($i = 0; $i < 50; $i++) {

                $status = rand(0, 10) > 2 ? 'up' : 'down';

                Check::create([
                    'domain_id' => $domain->id,
                    'status' => $status,
                    'http_code' => $status === 'up' ? 200 : 500,
                    'response_time' => rand(100, 800),
                    'error_message' => $status === 'down' ? 'Timeout' : null,
                    'checked_at' => now()->subMinutes(50 - $i),
                ]);
            }
        }
    }
}
