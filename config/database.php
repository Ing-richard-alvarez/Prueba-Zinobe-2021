<?php
 
use App\Models\Database;

session_start();

defined("DBDRIVER")or define('DBDRIVER','mysql');
defined("DBHOST")or define('DBHOST','127.0.0.1');
defined("DBNAME")or define('DBNAME','prueba-zinobe-2021');
defined("DBUSER")or define('DBUSER','root');
defined("DBPASS")or define('DBPASS','Dev-2020');

new Database();