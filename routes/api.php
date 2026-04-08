<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DomainController;
use App\Http\Controllers\Api\CheckController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/domains', [DomainController::class, 'index']);
    Route::post('/domains', [DomainController::class, 'store']);
    Route::get('/domains/{domain}', [DomainController::class, 'show']);
    Route::put('/domains/{domain}', [DomainController::class, 'update']);
    Route::delete('/domains/{domain}', [DomainController::class, 'destroy']);

    Route::get('/domains/{domain}/checks', [CheckController::class, 'index']);
});
