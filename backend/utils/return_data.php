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

function successMsg($message)
{
    return json_encode([
        "status" => "success",
        "error" => false,
        "message" => $message
    ]);
}

function returnData($data)
{
    return json_encode([
        "status" => "success",
        "error" => false,
        "payload" => $data
    ]);
}
