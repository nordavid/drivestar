
<?php
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
        'params' => ['email', 'password']
    ],
    'account/validatetoken' => [
        'handler' => 'validateJwtHandler',
        'method' => HttpRequestMethods::GET,
        'access' => AccessTypes::AUTHORIZATION,
        'params' => []
    ],
    'account/user' => [
        'handler' => 'getUserHandler',
        'method' => HttpRequestMethods::GET,
        'access' => AccessTypes::AUTHORIZATION,
        'params' => ['id']
    ],
    'exercise/start' => [
        'handler' => 'startExerciseHandler',
        'method' => HttpRequestMethods::POST,
        'access' => AccessTypes::AUTHORIZATION,
        'params' => ['type', 'minutes', 'question_count', 'categories']
    ],
    'exercise/result' => [
        'handler' => 'getExerciseResultHandler',
        'method' => HttpRequestMethods::GET,
        'access' => AccessTypes::AUTHORIZATION,
        'params' => ['id']
    ]
];
