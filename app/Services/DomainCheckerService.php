<?php

namespace App\Services;

use App\Models\Domain;
use Illuminate\Support\Facades\Http;

class DomainCheckerService
{
    public function check(Domain $domain): array
    {
        $start = microtime(true);

        try {
            $response = Http::timeout($domain->timeout)
                ->retry(2, 100)
                ->send($domain->method, $domain->url);

            return [
                'status' => $response->successful() ? 'up' : 'down',
                'code' => $response->status(),
                'time' => (microtime(true) - $start) * 1000,
                'error' => null
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'down',
                'code' => null,
                'time' => null,
                'error' => $e->getMessage()
            ];
        }
    }
}
