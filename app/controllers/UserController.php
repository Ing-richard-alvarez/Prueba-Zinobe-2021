<?php 
namespace App\Controllers;

require 'vendor/autoload.php';
require 'config/database.php';


use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\Diactoros\Response;
use Zend\Diactoros\Response\RedirectResponse;
use Zend\Diactoros\Response\JsonResponse;

use Illuminate\Support\Facades\Hash;

use Carbon\Carbon;

use App\Models\Database;
use App\Models\User;

class UserController {
    
    /**
     * Controller.
     *
     * @param \Psr\Http\Message\ServerRequestInterface $request
     *
     * @return \Psr\Http\Message\ResponseInterface
     */

    public function index(ServerRequestInterface $request): ResponseInterface {

        $templateDir = './resources/views';
        $loader = new \Twig\Loader\FilesystemLoader($templateDir);
        $twig = new \Twig\Environment($loader);

        // echo $twig->render('index.twig');

        error_log(__METHOD__.' logged => '.$this->isLogged());

        $response = new Response;
        $response->getBody()->write( $twig->render('index.twig',[
            'isLogged' => $this->isLogged(),
            'currentId' => isset($_SESSION['id'])? $_SESSION['id'] : ''
            ]) 
        );
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
                'password' => Hash::make($password)
            ]
        );

        return $user;
    }

    public function serviceCreateUser( ServerRequestInterface $request ): ResponseInterface
    {

        $result = [
            "data" => [],
            "status" => 500
        ];

        $params = $request->getParsedBody();

        // error_log(__METHOD__.' Request Params => '.var_export($params,true));

        // Create RuleList for validate every params
        $ruleList = [
            "name" => [
                "required" => true,
                "dataType" => "text"
            ],
            "document" => [
                "required" => true,
                "dataType" => "number"
            ],
            "email" => [
                "required" => true,
                "dataType" => "email"
            ],
            "country" => [
                "required" => true,
                "dataType" => "text"
            ],
            "password" => [
                "required" => true,
                "dataType" => "text"
            ],
            "confirm-password" => [
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

        
        $existEmailUser = User::where('email','=',$params['email'])->exists();
        $existDocumentlUser = User::where('document','=',$params['document'])->exists();

        if($existDocumentlUser) {
            $response = new JsonResponse(
                [
                    "error" => 'document',
                    "errorType" => "already_registered"
                ],
                500,
                ['Content-Type' => ['application/hal+json']]
            );

            return $response;
        }

        if($existEmailUser) {
            $response = new JsonResponse(
                [
                    "error" => 'email',
                    "errorType" => "already"
                ],
                500,
                ['Content-Type' => ['application/hal+json']]
            );

            return $response;
        }

        try {
            
            $user = User::create(
                [
                    'username' => $params['name'],
                    'document' => $params['document'],
                    'email' => $params['email'],
                    'country' => $params['country'],
                    'pass' => password_hash($params['password'], PASSWORD_DEFAULT)
                ]
            );

        } catch (\Throwable $th) {
            error_log(__METHOD__.' Error => '.var_export($th,true));

            $response = new JsonResponse(
                [
                    "error" => "InternalServerError"
                ],
                500,
                ['Content-Type' => ['application/hal+json']]
            );

            return $response;

        }

        $response = new JsonResponse(
            [],
            200,
            ['Content-Type' => ['application/hal+json']]
        );  

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