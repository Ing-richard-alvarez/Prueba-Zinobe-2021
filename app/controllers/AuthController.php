<?php
namespace App\Controllers;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Zend\Diactoros\Response;

use Carbon\Carbon;

class AuthController {

    /**
     * Controller.
     *
     * @param \Psr\Http\Message\ServerRequestInterface $request
     *
     * @return \Psr\Http\Message\ResponseInterface
     */

    function viewLogin(ServerRequestInterface $request): ResponseInterface {

        $templateDir = './resources/views';
        $loader = new \Twig\Loader\FilesystemLoader($templateDir);
        $twig = new \Twig\Environment($loader);

        $response = new Response;
        $response->getBody()->write( $twig->render('auth/login.twig') );
        return $response;
    }

}