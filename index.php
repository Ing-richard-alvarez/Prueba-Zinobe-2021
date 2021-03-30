<?php
require './vendor/autoload.php';
require 'config/routes.php';
require 'config/database.php';

use App\Models\Database;
//Initialize Illuminate Database Connection
new Database();
