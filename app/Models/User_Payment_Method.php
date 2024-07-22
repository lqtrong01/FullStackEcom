<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User_Payment_Method extends Model
{
    use HasFactory;

    protected $table =  'user_payment_methods';

    protected $fillable = [
        'user_id',
        'payment_type_id',
        'provider',
        'account_number',
        'expiry_date',
        'is_default'
    ];
}
