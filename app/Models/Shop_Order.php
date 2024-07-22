<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User_Review;
use App\Models\Order_Line;
use App\Models\Shipping_Method;
use App\Models\Site_User;
use App\Models\Order_Status;
use App\Models\Address;
use App\Models\User_Payment_Method;

class Shop_Order extends Model
{
    use HasFactory;

    protected $table = 'shop_orders';

    protected $fillable = [
        'user_id',
        'order_date',
        'payment_method_id',
        'shipping_address',
        'shipping_method',
        'order_total',
        'order_status',
        'created_at',
        'updated_at'
    ];
    public function user_id(){
        return $this->hasOne(Site_User::class, 'id', 'user_id');
    }
    public function order_lines()
    {
        return $this->hasMany(Order_Line::class, 'order_id', 'id');
    }

    public function order_statuses()
    {
        return $this->hasOne(Order_Status::class, 'id', 'order_status');
    }

    public function shipping_methods()
    {
        return $this->hasOne(Shipping_Method::class, 'id', 'shipping_method');
    }

    public function user_reviews()
    {
        return $this->hasManyThrough(User_Review::class, Order_Line::class, 'order_id', 'id', 'id', 'order_product_id');
    }

    public function shipping_addresses(){
        return $this->hasOne(Address::class, 'id','shipping_address');
    }

    public function payment_method_ids(){
        return $this->hasOne(Payment_Type::class, 'id', 'payment_method_id');
    }
}
