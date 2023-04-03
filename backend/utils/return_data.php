<?php
function errorMsg($message = "Es ist ein Fehler aufgetreten", $httpErrorCode = 400)
{
    http_response_code($httpErrorCode);
    return json_encode([
        "status" => "error",
        "error" => true,
        "message" => $message
    ]);
}

function successMsg($message, $httpStatus = 200)
{
    http_response_code($httpStatus);
    return json_encode([
        "status" => "success",
        "error" => false,
        "message" => $message
    ]);
}

function returnData($data, $httpStatus = 200)
{
    http_response_code($httpStatus);
    return json_encode([
        "status" => "success",
        "error" => false,
        "payload" => $data
    ]);
}
