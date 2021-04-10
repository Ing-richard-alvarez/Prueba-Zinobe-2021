<?php declare(strict_types=1);

require 'vendor/autoload.php';

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

$request = Laminas\Diactoros\ServerRequestFactory::fromGlobals(
    $_SERVER, $_GET, $_POST, $_COOKIE, $_FILES
);

$router = new League\Route\Router;

$router->map('GET', '/', 'App\Controllers\UserController::index');
$router->map('GET', '/login', 'App\Controllers\AuthController::viewLogin');
$router->map('GET', '/register', 'App\Controllers\AuthController::viewUserRegister');
$router->map('POST', '/s/service-create', 'App\Controllers\UserController::serviceCreateUser');

$response = $router->dispatch($request);


// send the response to the browser
(new Laminas\HttpHandlerRunner\Emitter\SapiEmitter)->emit($response);