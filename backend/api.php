<?php
require_once('./init.php');
header('Content-Type: application/json; charset=utf-8');

enum AccessTypes
{
    case AUTHORIZATION;
    case PUBLIC;
}

enum HttpRequestMethods
{
    case GET;
    case POST;
    case PUT;
    case UPDDATE;
    case DELETE;
}

$endpoints = [
    'account/register' => [
        'handler' => 'registerHandler',
        'method' => HttpRequestMethods::POST,
        'access' => AccessTypes::PUBLIC,
        'params' => ['username', 'email', 'password']
    ],
    'account/login' => [
        'handler' => 'loginHandler',
        'method' => HttpRequestMethods::POST,
        'access' => AccessTypes::PUBLIC,
        'params' => ['username', 'password']
    ],
    'account/user' => [
        'handler' => 'getUserHandler',
        'method' => HttpRequestMethods::GET,
        'access' => AccessTypes::AUTHORIZATION,
        'params' => ['id']
    ],
];

if (isset($_SERVER['PATH_INFO'])) {
    $endpoint = ltrim($_SERVER['PATH_INFO'], "/");
} else {
    http_response_code(404);
    die(errorMsg("Endpoint nicht gefunden [PI]"));
}

if (array_key_exists($endpoint, $endpoints)) {
    $access = $endpoints[$endpoint]['access'];
    $handler = $endpoints[$endpoint]['handler'];
    $method = $endpoints[$endpoint]['method'];
    $params = $endpoints[$endpoint]['params'];

    if (get_server_request_method() === $method) {

        if ($access !== AccessTypes::PUBLIC) {
            require_once("./utils/jwt_util.php");
            $bearerToken = get_bearer_token();

            if (!$bearerToken)
                die(errorMsg("Nicht authorisiert"));


            if (!validate_token($bearerToken))
                die(errorMsg("Nicht authorisiert"));
        }

        $requestParams = ($method === HttpRequestMethods::POST) ? $_POST : $_GET;
        $args = [];

        foreach ($params as $param) {
            if (isset($requestParams[$param])) {
                $args[] = $requestParams[$param];
            } else {
                // parameter missing = bad request
                http_response_code(400);
                die(errorMsg("Notweniger Parameter fehlt: " . $param));
            }
        }

        require_once("./endpoints/$endpoint.php");

        if (function_exists($handler))
            call_user_func_array($handler, $args);
        else
            die(errorMsg());
    } else {
        http_response_code(405);
        echo errorMsg("Request-Methode nicht erlaubt");
    }
} else {
    http_response_code(404);
    echo errorMsg("Endpoint nicht gefunden [$endpoint]");
}

function get_server_request_method(): HttpRequestMethods
{
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            return HttpRequestMethods::GET;
            break;
        case 'POST':
            return HttpRequestMethods::POST;
            break;
        default:
            return null;
            break;
    }
}
