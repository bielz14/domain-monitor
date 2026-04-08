<?php

use Illuminate\Support\Facades\Schedule;
use App\Models\Domain;
use App\Jobs\CheckDomainJob;

Schedule::call(function () {

    Domain::query()
        ->whereRaw('last_checked_at IS NULL OR NOW() >= last_checked_at + INTERVAL check_interval SECOND')
        ->chunk(100, function ($domains) {
            foreach ($domains as $domain) {
                CheckDomainJob::dispatch($domain);
            }
        });

})->everyMinute();
