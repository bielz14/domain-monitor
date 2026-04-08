<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Domain;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DomainController extends Controller
{
    public function index(): JsonResponse
    {
        $domains = auth()->user()
            ->domains()
            ->with([
                'checks' => fn ($query) => $query->latest('checked_at')->limit(1),
            ])
            ->latest()
            ->get();

        return response()->json($domains);
    }

    public function show(Domain $domain): JsonResponse
    {
        abort_if($domain->user_id !== auth()->id(), 403);

        $domain->load([
            'checks' => fn ($query) => $query->latest('checked_at')->limit(20),
        ]);

        return response()->json($domain);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'url' => ['required', 'string', 'max:255'],
            'check_interval' => ['required', 'integer', 'min:60', 'max:86400'],
            'timeout' => ['required', 'integer', 'min:1', 'max:60'],
            'method' => ['required', Rule::in(['GET', 'HEAD'])],
        ]);

        $domain = auth()->user()->domains()->create($validated);

        return response()->json($domain, 201);
    }

    public function update(Request $request, Domain $domain): JsonResponse
    {
        abort_if($domain->user_id !== auth()->id(), 403);

        $validated = $request->validate([
            'url' => ['required', 'string', 'max:255'],
            'check_interval' => ['required', 'integer', 'min:60', 'max:86400'],
            'timeout' => ['required', 'integer', 'min:1', 'max:60'],
            'method' => ['required', Rule::in(['GET', 'HEAD'])],
        ]);

        $domain->update($validated);

        return response()->json($domain);
    }

    public function destroy(Domain $domain): JsonResponse
    {
        abort_if($domain->user_id !== auth()->id(), 403);

        $domain->delete();

        return response()->json(['message' => 'Domain deleted']);
    }
}
