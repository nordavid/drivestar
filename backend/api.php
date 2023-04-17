<?php
require_once('./init.php');
require_once('./api_types.php');
require_once("./utils/jwt_util.php");

header('Content-Type: application/json; charset=utf-8');

if (isset($_SERVER['PATH_INFO'])) {
    $requestedEndpoint = ltrim($_SERVER['PATH_INFO'], "/");
} else {
    http_response_code(404);
    die(errorMsg("Endpoint nicht gefunden [PI]"));
}

if (!array_key_exists($requestedEndpoint, $endpoints)) {
    die(errorMsg("Endpoint nicht gefunden [$requestedEndpoint]", 404));
}

$access = $endpoints[$requestedEndpoint]['access'];
$handler = $endpoints[$requestedEndpoint]['handler'];
$method = $endpoints[$requestedEndpoint]['method'];
$params = $endpoints[$requestedEndpoint]['params'];

if (get_server_request_method() !== $method) {
    die(errorMsg("Request-Methode nicht erlaubt", 405));
}

if ($access !== AccessTypes::PUBLIC) {
    check_authentication();
}

$requestParams = ($method === HttpRequestMethods::POST) ? $_POST : $_GET;
$args = [];

foreach ($params as $param) {
    if (isset($requestParams[$param])) {
        $args[] = $requestParams[$param];
    } else {
        // parameter missing = bad request
        die(errorMsg("Notweniger Parameter fehlt: " . $param, 400));
    }
}

require_once("./endpoints/$requestedEndpoint.php");

if (!function_exists($handler)) {
    die(errorMsg());
}

call_user_func_array($handler, $args);

// Check if submitted token exists and is valid
function check_authentication()
{
    $bearerToken = get_bearer_token();

    if (!$bearerToken)
        die(errorMsg("Nicht authorisiert. Token nicht gefunden.", 401));


    if (!validate_token($bearerToken))
        die(errorMsg("Nicht authorisiert. Token konnte nicht validiert werden. $bearerToken", 401));
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
