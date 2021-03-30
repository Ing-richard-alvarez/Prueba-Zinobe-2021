<?php 
namespace App\Controllers;

require 'vendor/autoload.php';

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Zend\Diactoros\Response;

use Carbon\Carbon;


use App\Models\User;

class UserController {
    
    /**
     * Controller.
     *
     * @param \Psr\Http\Message\ServerRequestInterface $request
     *
     * @return \Psr\Http\Message\ResponseInterface
     */

    function index(ServerRequestInterface $request): ResponseInterface {

        $templateDir = './resources/views';
        $loader = new \Twig\Loader\FilesystemLoader($templateDir);
        $twig = new \Twig\Environment($loader);

        // echo $twig->render('index.twig');

        $response = new Response;
        $response->getBody()->write( $twig->render('index.twig') );
        return $response;
    }

    public static function create_user($name, $document, $email, $country,$password)
    {
        
        $user = User::create(
            [
                'name' => $name,
                'document' => $document,
                'email' => $email,
                'country' => $country,
                'password' => $password
            ]
        );

        return $user;
    }

}