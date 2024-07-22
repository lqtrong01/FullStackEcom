<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Shopping_Cart;
use App\Models\Product_Item;

class Shopping_Cart_Item extends Model
{
    use HasFactory;

    protected $table = 'shopping_cart_items';

    protected $fillable = ['cart_id', 'product_item_id', 'qty', 'product_image'];

    public function cart()
    {
        return $this->belongsTo(Shopping_Cart::class, 'cart_id');
    }

    public function product()
    {
        return $this->hasOne(Product_Item::class, 'product_id', 'product_item_id');
    }
}
