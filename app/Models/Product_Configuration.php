<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Product_Item;
use App\Models\Variation_Opition;

class Product_Configuration extends Model
{
    use HasFactory;

    protected $table = 'product_configurations';

    protected $fillable = ['product_item_id', 'variation_option_id'];

    public function productItem()
    {
        return $this->belongsTo(Product_Item::class, 'product_item_id');
    }

    public function variationOption()
    {
        return $this->belongsTo(Variation_Opition::class, 'variation_option_id');
    }
}
