<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Type_Product extends Model
{
    use HasFactory;

    protected $table = 'type_products';
    protected $fillable = [
        'id',
        'type',
        'created_at',
        'updated_at'
    ];
}
