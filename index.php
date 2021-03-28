<?php
require 'vendor/autoload.php';
require 'config/database.php';

use App\Models\Database;
//Initialize Illuminate Database Connection
new Database();

// $templateDir = './resources/views';
// $loader = new \Twig\Loader\FilesystemLoader($templateDir);
// $twig = new \Twig\Environment($loader);

// echo $twig->render('index.twig');