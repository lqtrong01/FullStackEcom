<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Product;
use App\Models\Site_User;

class favourite extends Model
{
    use HasFactory;

    protected $table = 'favourites';

    protected $fillable = [
        'user_id',
        'product_id',
        'is_default'
    ];

    public function product_id(){
        return $this->hasOne(Product::class, 'id', 'product_id');
    }
}
