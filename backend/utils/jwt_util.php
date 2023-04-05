<?php
function create_token(array $userObj, int $expiresIn = 604800): string
{
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode([
        'iat'  => time(),
        'iss'  => $_SERVER['SERVER_NAME'],
        'nbf'  => time(),
        'exp' => time() + $expiresIn,
        'user' => $userObj,
    ]);

    $base64UrlHeader = base64url_encode($header);
    $base64UrlPayload = base64url_encode($payload);

    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, getenv("SECRET_KEY"), true);
    $encodedSignature = base64url_encode($signature);

    $jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $encodedSignature;
    return $jwt;
}

function validate_token(string $jwt)
{
    $parts = explode(".", $jwt);

    if (empty($parts[0]) || empty($parts[1]) || empty($parts[2])) {
        return false;
    }

    $header = $parts[0];
    $payload = $parts[1];
    $signature = $parts[2];

    $valid_signature = hash_hmac('sha256', $header . "." . $payload, getenv("SECRET_KEY"), true);
    $base64_url_signature = base64url_encode($valid_signature);
    if ($signature !== $base64_url_signature) {
        return false;
    }

    $payloadObj = json_decode(base64url_decode($payload));
    if (!isset($payloadObj->exp) || time() > $payloadObj->exp) {
        return false;
    }

    return true;
}

function get_auth_header(): string | null
{
    $headers = null;
    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER["Authorization"]);
    } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }
    return $headers;
}

function get_bearer_token(): string | null
{
    $headers = get_auth_header();

    if (!empty($headers)) {
        $tokenArray = explode(" ", $headers);
        if (count($tokenArray) == 2) {
            $jwt = $tokenArray[1];
            return $jwt;
        }
    }
    return null;
}

function base64url_encode($data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data): string
{
    return base64_decode(strtr($data, '-_', '+/'));
}
