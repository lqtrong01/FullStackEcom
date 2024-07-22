<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Shop_Order;

class Order_Status extends Model
{
    use HasFactory;

    protected $table = 'order_statuses';

    protected $fillable = [
        'status',
        'created_at',
        'updated_at'
    ];
}
