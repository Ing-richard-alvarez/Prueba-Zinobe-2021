<?php

use App\Controllers\UserController;
use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

return function (RoutingConfigurator $routes) {
    error_log(__METHOD__.' file ');
    $routes->add('home', '/')
        // the controller value has the format [controller_class, method_name]
        ->controller([UserController::class, 'index'])
    ;
    $routes->add('login', '/login')
        // the controller value has the format [controller_class, method_name]
        ->controller([UserController::class, 'login'])
    ;
};