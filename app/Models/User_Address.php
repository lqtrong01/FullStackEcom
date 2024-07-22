<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Site_User;

class User_Address extends Model
{
    use HasFactory;

    protected $table ='user_addresses';

    protected $fillable = [
        'id',
        'user_id',
        'address_id',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'user_id'=>'integer',
        'address_id'=>'string',
        'created_at'=>'datetime',
        'updated_at'=>'datetime',
    ];

    public function user_address()
    {
        return $this->hasOne(Site_User::class, 'site_user_id');
    }
}
