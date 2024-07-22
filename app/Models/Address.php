<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Country;

class Address extends Model
{
    use HasFactory;

    protected $table = 'addresses';

    protected $fillable = [
        'address_line',
        'city',
        'country_id',
        'created_at',
        'updated_at'
    ];

    protected $hidden = [];

    protected $casts = [
        'created_at'=>'datetime',
        'updated_at'=>'datetime',
    ];

}
