<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Product_Item;
use App\Models\Product_Category;
use App\Models\User_Review;
use App\Models\Variation;
use App\Models\Variation_Opition;
use App\Models\Product_Configuration;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products';

    protected $fillable = [
        'category_id',
        'name',
        'description',
        'product_image',
        'type',
        'created_at',
        'updated_at'
    ];  

    protected $hidden = [

    ];

    protected $casts = [
        'category_id'=>'integer',
        'name'=>'string',
        'type'=>'string',
        'description'=>'string',
        'product_image'=>'string',
        'created_at'=>'datetime',
        'updated_at'=>'datetime'
    ];

    public function product_item()
    {
        return $this->hasOne(Product_Item::class);
    }

    public function category()
    {
        return $this->beLongsTo(Product_Category::class);
    }

    public function reviews()
    {
        return $this->hasMany(User_Review::class, 'order_product_id');
    }

    public function configurations()
    {
        return $this->hasMany(Product_Configuration::class, 'product_item_id');
    }
    public function items()
    {
        return $this->hasMany(Product_Item::class);
    }
}
