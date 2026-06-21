<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $method = strtolower($request->getMethod());

        // Always skip CORS preflight — handled by CorsFilter
        if ($method === 'options') {
            return;
        }

        // Skip auth for the login endpoint itself (both raw URI and routed path)
        $path = '/' . ltrim($request->getUri()->getPath(), '/');
        if (str_contains($path, '/auth/login') || str_contains($path, 'api/auth/login')) {
            return;
        }

        // Read-only endpoints are public (GET/HEAD)
        if (in_array($method, ['get', 'head'])) {
            return;
        }

        // Resolve Authorization header from multiple sources for compatibility
        $authHeader = $request->header('Authorization');
        if ($authHeader instanceof \CodeIgniter\HTTP\Header) {
            $authHeader = $authHeader->getValue();
        } elseif ($authHeader === null) {
            $authHeader = $request->getServer('HTTP_AUTHORIZATION');
        } elseif (is_string($authHeader) && $authHeader === '') {
            $authHeader = $request->getServer('HTTP_AUTHORIZATION');
        }

        // Also check REDIRECT_HTTP_AUTHORIZATION (common when PHP runs behind Apache rewrites)
        if (empty($authHeader)) {
            $authHeader = $request->getServer('REDIRECT_HTTP_AUTHORIZATION');
        }

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            $response = service('response');
            $response->setStatusCode(401);
            return $response->setJSON([
                'status'  => 401,
                'success' => false,
                'error'   => 'Akses Ditolak: Anda membutuhkan Authorization Bearer Token!'
            ]);
        }

        $token = substr($authHeader, 7);
        if ($token !== 'mock-jwt-admin-secret-token') {
            $response = service('response');
            $response->setStatusCode(401);
            return $response->setJSON([
                'status'  => 401,
                'success' => false,
                'error'   => 'Token Kedaluwarsa atau Batil: Sesi admin tidak valid.'
            ]);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        return $response;
    }
}
