<?php 
namespace App\Controllers;

require '../../vendor/autoload.php';
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;


use Carbon\Carbon;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

use App\Models\User;

class UserController extends AbstractController{

    $templateDir = './resources/views';
    $loader = new \Twig\Loader\FilesystemLoader($templateDir);
    $twig = new \Twig\Environment($loader);

    
    /**
     * @Route("/", name="home")
     */
    public function index() 
    {
        error_log(__METHOD__.' Home ');
        return $twig->render('index.twig', ['the' => 'variables', 'go' => 'here']);
    }

    /**
     * @Route("/login", name="login")
     */
    public function login() 
    {
        error_log(__METHOD__.' Home ');
        return $twig->render('auth/login.twig', ['the' => 'variables', 'go' => 'here']);
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