<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Product;

class Product_Category extends Model
{
    use HasFactory;

    protected $table = 'product_categories';

    protected $fillable = [
        'parent_category_id',
        'category_name',
        'created_at',
        'updated_at'
    ];

    protected $hidden = [];

    protected $casts = [
        'parent_category_id'=>'integer',
        'category_name'=>'string',
        'created_at'=>'datetime',
        'updated_at'=>'datetime'
    ];

    public function product()
    {
        return $this->hasMany(Product::class, 'category_id', 'id');
    }
}
