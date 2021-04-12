<?php
namespace App\Models;

use \Illuminate\Database\Eloquent\Model;
 
class Request extends Model {

    protected $casts = [
        'metadata' => 'array',
    ];

    protected $table = 'requests';
    protected $fillable = ['metadata','user_id'];

    public function requests()
    {
        return $this->hasMany(User::class);
    }

}