<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Product;
use App\Models\Shopping_Cart_Item;
use App\Models\Product_Configuration;

class Product_Item extends Model
{
    use HasFactory;

    protected $table = 'product_items';

    protected $fillable = [
        'id',
        'product_id',
        'SKU',
        'qty_in_stock',
        'product_image',
        'price',
        'rating',
        'created_at',
        'updated_at'
    ];

    protected $hidden = [

    ];

    protected $casts = [
        'product_id'=>'integer',
        'SKU'=>'integer',
        'qty_in_stock'=>'integer',
        'product_image'=>'string',
        'price'=>'decimal:2',
        'rating'=>'double',
        'created_at'=>'datetime',
        'updated_at'=>'datetime'
    ];

    public function product()
    {
        return $this->beLongsTo(Product::class);
    }

    public function cartItems()
    {
        return $this->hasMany(Shopping_Cart_Item::class, 'product_item_id');
    }

    public function configurations()
    {
        return $this->hasMany(Product_Configuration::class, 'product_item_id');
    }
}
