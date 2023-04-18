
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
        'params' => ['username', 'email', 'password', 'upload_profilepicture']
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
        'params' => []
    ],
    'exercise/start' => [
        'handler' => 'startExerciseHandler',
        'method' => HttpRequestMethods::POST,
        'access' => AccessTypes::AUTHORIZATION,
        'params' => ['type', 'duration', 'question_count', 'categories']
    ],
    'exercise/useranswer' => [
        'handler' => 'userAnswerHandler',
        'method' => HttpRequestMethods::POST,
        'access' => AccessTypes::AUTHORIZATION,
        'params' => ['exercise_id', 'question_id', 'user_answers']
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
    'category/stats' => [
        'handler' => 'getCategoryStatsHandler',
        'method' => HttpRequestMethods::GET,
        'access' => AccessTypes::AUTHORIZATION,
        'params' => []
    ],
    'question' => [
        'handler' => 'getQuestionByIdHandler',
        'method' => HttpRequestMethods::GET,
        'access' => AccessTypes::AUTHORIZATION,
        'params' => ['id']
    ],
    'question/category' => [
        'handler' => 'getQuestionsByCategoryIdHandler',
        'method' => HttpRequestMethods::GET,
        'access' => AccessTypes::AUTHORIZATION,
        'params' => ['id', 'bookmarked']
    ],
    'question/progress' => [
        'handler' => 'getQuestionsProgressHandler',
        'method' => HttpRequestMethods::GET,
        'access' => AccessTypes::AUTHORIZATION,
        'params' => []
    ],
    'question/bookmark' => [
        'handler' => 'bookmarkQuestionHandler',
        'method' => HttpRequestMethods::POST,
        'access' => AccessTypes::AUTHORIZATION,
        'params' => ['id']
    ]
];
