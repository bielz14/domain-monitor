<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use App\Services\DomainCheckerService;
use App\Models\Check;
use App\Models\Domain;

class CheckDomainJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Domain $domain) {}

    public function handle(DomainCheckerService $service)
    {
        $result = $service->check($this->domain);

        Check::create([
            'domain_id' => $this->domain->id,
            'status' => $result['status'],
            'http_code' => $result['code'],
            'response_time' => $result['time'],
            'error_message' => $result['error'],
            'checked_at' => now(),
        ]);

        $this->domain->update([
            'last_checked_at' => now()
        ]);
    }
}
