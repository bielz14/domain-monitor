<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Domain;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CheckController extends Controller
{
    public function index(Request $request, Domain $domain): JsonResponse
    {
        abort_if($domain->user_id !== auth()->id(), 403);

        $validated = $request->validate([
            'status' => ['nullable', Rule::in(['up', 'down'])],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $perPage = $validated['per_page'] ?? 20;

        $query = $domain->checks()->latest('checked_at');

        if (!empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        if (!empty($validated['date_from'])) {
            $query->whereDate('checked_at', '>=', $validated['date_from']);
        }

        if (!empty($validated['date_to'])) {
            $query->whereDate('checked_at', '<=', $validated['date_to']);
        }

        $checks = $query->paginate($perPage);

        return response()->json($checks);
    }
}
