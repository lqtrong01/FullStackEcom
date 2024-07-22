<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment_Type extends Model
{
    use HasFactory;

    protected $table = 'payment_types';

    protected $fillabe = [
        'id',
        'value',
        'created_at',
        'updated_at'
    ];

    
}
