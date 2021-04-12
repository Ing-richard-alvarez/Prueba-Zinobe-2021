<?php
 
use App\Models\Database;

session_start();

defined("DBDRIVER")or define('DBDRIVER','mysql');
defined("DBHOST")or define('DBHOST','host_database');
defined("DBNAME")or define('DBNAME','name_database');
defined("DBUSER")or define('DBUSER','user_database');
defined("DBPASS")or define('DBPASS','password_database');

new Database();