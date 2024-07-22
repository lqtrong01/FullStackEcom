<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipping_Method extends Model
{
    use HasFactory;

    protected $table = 'shipping_methods';

    protected $fillable = [
        'name',
        'price'
    ];

    protected $casts = [
        'name'=>'string',
        'price'=>'decimal:2'
    ];

}
