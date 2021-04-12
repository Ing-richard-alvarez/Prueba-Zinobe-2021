<?php

namespace App\Models;

use \Illuminate\Database\Eloquent\Model;
 
class User extends Model {
    protected $table = 'usersZinobe';
    protected $fillable = ['username','document','email','country','pass'];
}

?>