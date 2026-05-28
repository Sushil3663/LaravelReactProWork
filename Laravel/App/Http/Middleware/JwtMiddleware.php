<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json([
                    'resCode' => '401',
                    'resDesc' => 'User not found',
                    'data' => null,
                ], 401);
            }

            $request->merge([
                'auth' => [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'name' => $user->name,
                    'role' => $user->role,
                ]
            ]);

        } catch (TokenExpiredException $e) {
            return response()->json([
                'resCode' => '401',
                'resDesc' => 'Token expired',
                'data' => null,
            ], 401);
        } catch (TokenInvalidException $e) {
            return response()->json([
                'resCode' => '401',
                'resDesc' => 'Token invalid',
                'data' => null,
            ], 401);
        } catch (\Exception $e) {
            return response()->json([
                'resCode' => '401',
                'resDesc' => 'Token not provided',
                'data' => null,
            ], 401);
        }

        return $next($request);
    }
}