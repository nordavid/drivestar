
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
        'params' => ['type', 'duration', 'question_count', 'categories']
    ],
    'exercise/result' => [
        'handler' => 'getExerciseResultHandler',
        'method' => HttpRequestMethods::GET,
        'access' => AccessTypes::AUTHORIZATION,
        'params' => ['id']
    ],
    'exercise/stats' => [
        'handler' => 'getExerciseStatsHandler',
        'method' => HttpRequestMethods::GET,
        'access' => AccessTypes::AUTHORIZATION,
        'params' => []
    ],
    'category' => [
        'handler' => 'getCategoriesHandler',
        'method' => HttpRequestMethods::GET,
        'access' => AccessTypes::AUTHORIZATION,
        'params' => ['filter']
    ],
    'category/all' => [
        'handler' => 'getCategoriesHandler',
        'method' => HttpRequestMethods::GET,
        'access' => AccessTypes::AUTHORIZATION,
        'params' => []
    ],
    'category/section' => [
        'handler' => 'getCategoriesForSectionHandler',
        'method' => HttpRequestMethods::GET,
        'access' => AccessTypes::AUTHORIZATION,
        'params' => ['section']
    ],
    'category/bookmarked' => [
        'handler' => 'getCategoriesBookmarkedHandler',
        'method' => HttpRequestMethods::GET,
        'access' => AccessTypes::AUTHORIZATION,
        'params' => []
    ],
    'category/stats' => [
        'handler' => 'getCategoryStatsHandler',
        'method' => HttpRequestMethods::GET,
        'access' => AccessTypes::AUTHORIZATION,
        'params' => []
    ]
];
