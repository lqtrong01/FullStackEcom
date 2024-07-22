<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Site_User;
use App\Models\Order_Line;
use App\Models\Product;
use App\Models\Product_Item;

class User_Review extends Model
{
    use HasFactory;

    protected $table = 'user_reviews';

    protected $fillable = [
        'id',
        'user_id',
        'ordered_product_id',
        'rating_value',
        'comment',
        'is_review'
    ];

    protected $casts = [

    ];

    public function order_line(){
        return $this->belongsTo(Order_Line::class, 'id');
    }
    public function user_id(){
        return $this->hasOne(Site_User::class, 'id', 'user_id');
    }
}
