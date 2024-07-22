<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Shopping_Cart_Item;
use App\Models\Site_User;
use App\Models\Product_Item;


class Shopping_Cart extends Model
{
    use HasFactory;

    protected $table='shopping_carts';

    protected $fillable = ['id','user_id'];

    protected $casts = [
        'user_id'=>'integer',
        'created_at'=>'datetime',
        'updated_at'=>'datetime'
    ];

    public function shopping_cart_item(){
        return $this->hasMany(Shopping_Cart_Item::class, 'cart_id', 'id');
    }

    public function cart_user(){
        return $this->hasManyThrough(Shopping_Cart_Item::class, Site_User::class, 'id', 'cart_id', 'user_id', 'id');
    }

    public function items()
    {
        return $this->hasMany(Shopping_Cart_Item::class, 'cart_id');
    }

    public function user()
    {
        return $this->belongsTo(SiteUser::class, 'user_id');
    }
}
