<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::get('/auth-user', [AuthController::class, 'user']);

Route::view('/{any?}', 'app')->where('any', '.*');
