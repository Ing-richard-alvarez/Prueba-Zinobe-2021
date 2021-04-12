<?php
namespace App\Controllers;

require 'config/database.php';

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Zend\Diactoros\Response;
use Zend\Diactoros\Response\RedirectResponse;
use Zend\Diactoros\Response\JsonResponse;

use Carbon\Carbon;

use App\Models\Database;
use App\Models\User;

class AuthController {

    /**
     * Controller.
     *
     * @param \Psr\Http\Message\ServerRequestInterface $request
     *
     * @return \Psr\Http\Message\ResponseInterface
     */

    function viewLogin(ServerRequestInterface $request): ResponseInterface 
    {
        if($this->isLogged()){

            $response = new RedirectResponse('/', 301);
            return $response;

        } 

        $templateDir = './resources/views';
        $loader = new \Twig\Loader\FilesystemLoader($templateDir);
        $twig = new \Twig\Environment($loader);

        $response = new Response;
        $response->getBody()->write( $twig->render('auth/login.twig',[]) );
        return $response;
    }

    function viewUserRegister(ServerRequestInterface $request): ResponseInterface 
    {
        if($this->isLogged()){

            $response = new RedirectResponse('/', 301);
            return $response;

        } 

        $templateDir = './resources/views';
        $loader = new \Twig\Loader\FilesystemLoader($templateDir);
        $twig = new \Twig\Environment($loader);

        $response = new Response;
        $response->getBody()->write( $twig->render('auth/register.twig') );
        return $response;
    }

    public function serviceLogin( ServerRequestInterface $request ): ResponseInterface
    {

        $result = [
            "data" => [],
            "status" => 500
        ];

        $params = $request->getParsedBody();

        error_log(__METHOD__.' Request Params => '.var_export($params,true));

        // Create RuleList for validate every params
        $ruleList = [
            "username" => [
                "required" => true,
                "dataType" => "text"
            ],
            "password" => [
                "required" => true,
                "dataType" => "text"
            ]
        ];

        $isValid = $this->validateParams($params,$ruleList);

        if(!$isValid) {
            $response = new JsonResponse(
                $isValid,
                500,
                ['Content-Type' => ['application/hal+json']]
            );

            return $response;
        }

        $userExist = User::where('email','=',$params['username'])->exists(); 
        


        if(!$userExist) {
            
            $response = new JsonResponse(
                [
                    "error" => 'username',
                    "errorType" => "notfound"
                ],
                500,
                ['Content-Type' => ['application/hal+json']]
            );

            return $response;
        } else {

            $userDetail = User::where('email','=',$params['username'])->first();
            $passwordUser = $userDetail->pass;

            if(password_verify($params['password'], $passwordUser)) {
            
                session_regenerate_id();
    
                $_SESSION['loggedin'] = TRUE;
                $_SESSION['name'] = $params['username'];
                $_SESSION['id'] = $userDetail->id;
    
                error_log(__METHOD__.' is logged => '.$this->isLogged());
    
            } else {
                $response = new JsonResponse(
                    [
                        "error" => 'username',
                        "errorType" => "notfound"
                    ],
                    500,
                    ['Content-Type' => ['application/hal+json']]
                );
    
                return $response;
            }

        }

        // error_log(__METHOD__.' existe el usuario => '.$passwordUser);
        
        $response = new JsonResponse(
            [],
            200,
            ['Content-Type' => ['application/hal+json']]
        );  

        return $response;

    }

    public function serviceLogout( ServerRequestInterface $request ): ResponseInterface
    {

        $response = new RedirectResponse('/login', 301);

        // destroy sessions
        session_destroy();
        
        return $response;

    }

    public function validateParams(&$params,$ruleList)
    {
        //error_log(__METHOD__.' Params => '.var_export($params,true));
        //error_log(__METHOD__.' Rule list => '.var_export($ruleList,true));

        foreach($ruleList as $key => $value) {
    
            error_log(__METHOD__.' data type => '. $params[$key]);   

            if(
                isset($value['required']) &&
                array_key_exists('required',$value)
            ){

                if(
                    isset($value['dataType']) &&
                    array_key_exists('dataType',$value) &&
                    trim($value['dataType']) == "text" &&
                    trim($params[$key]) == ""
                ){
                    return [
                        "error" => $key,
                        "errorType" => "required"
                    ];
                } elseif(
                    isset($value['dataType']) &&
                    array_key_exists('dataType',$value) &&
                    trim($value['dataType']) == "number" &&
                    trim($params[$key]) == ""
                ){
                    return [
                        "error" => $key,
                        "errorType" => "required"
                    ];
                } elseif(
                    isset($value['dataType']) &&
                    array_key_exists('dataType',$value) &&
                    trim($value['dataType']) == "number" &&
                    !is_numeric($params[$key])
                ){
                    return [
                        "error" => $key,
                        "errorType" => "invalid"
                    ];
                } elseif(
                    isset($value['dataType']) &&
                    array_key_exists('dataType',$value) &&
                    trim($value['dataType']) == "email" &&
                    trim($params[$key]) == ""
                ){
                    return [
                        "error" => $key,
                        "errorType" => "required"
                    ];
                } elseif(
                    isset($value['dataType']) &&
                    array_key_exists('dataType',$value) &&
                    trim($value['dataType']) == "email" &&
                    !preg_match("/^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/ix", $params[$key])
                ) {
                    return [
                        "error" => $key,
                        "errorType" => "invalid"
                    ];
                }
                //error_log(__METHOD__.' Params => '.var_export($value,true));
            }
        }

        return true;
    }

    public function isLogged()
    {
        if(
            !(
                isset( $_SESSION['loggedin']) &&
                $_SESSION['loggedin'] == true
            )
        ) {
            return false;
        }

        return true;
    }
}