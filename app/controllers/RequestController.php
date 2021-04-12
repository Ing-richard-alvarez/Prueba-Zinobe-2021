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
use App\Models\Request;

class RequestController {

    /**
     * Controller.
     *
     * @param \Psr\Http\Message\ServerRequestInterface $request
     *
     * @return \Psr\Http\Message\ResponseInterface
    */

    public function serviceSaveRequest( ServerRequestInterface $request ): ResponseInterface
    {

        $result = [
            "data" => [],
            "status" => 500
        ];

        $params = $request->getParsedBody();

        error_log(__METHOD__.' Request Params => '.var_export($params,true));

        try {

            $req = Request::create(
                [
                    'metadata' => $params['metadata'],
                    'user_id' => $params['userId']
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

}