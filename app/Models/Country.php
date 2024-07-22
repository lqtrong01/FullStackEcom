<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Address;

class Country extends Model
{
    use HasFactory;

    protected $table= 'countries';

    protected $fillable = [
        'id',
        'country_name',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'id'=>'integer',
        'country_name'=>'string',
        'created_at'=>'datetime',
        'updated_at'=>'datetime'
    ];
}
