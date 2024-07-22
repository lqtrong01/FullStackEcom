<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User_Review;
use App\Models\Product;
use App\Models\Product_Item;

class Order_Line extends Model
{
    use HasFactory;
    protected $table = 'order_lines';

    protected $fillable = [
        'id',
        'product_item_id',
        'order_id',
        'qty',
        'price',
        'created_at',
        'updated_at'
    ];

    public function user_review()
    {
        return $this->hasOne(User_Review::class, 'ordered_product_id','id');
    }

    public function product(){
        return $this->hasOne(Product::class, 'id', 'product_item_id');
    }
}
