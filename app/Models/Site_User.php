<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Address;
use App\Models\User_Adress;
use App\Models\Country;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Shopping_Cart_Item;
use App\Models\Shopping_Cart;
use App\Models\User_Review;

class Site_User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'site_users';

    protected $fillable = [
        'email',
        'name',
        'phone_number',
        'password',
        'email_verified_at',
        'remember_token',
        'user_image',
        'role',
        'created_at',
        'updated_at',
    ];

    protected $hidden = [];

    protected $casts = [
        'name'=>'string',
        'email_verified_at'=>'datetime',
        'created_at'=>'datetime',
        'updated_at'=>'datetime'
    ];

    public function user_addresses()
    {
        return $this->hasOne(User_Address::class, 'user_id');
    }

    public function addresses()
    {
        $userAddresses = $this->user_addresses;
        $addressIds = json_decode($userAddresses->address_id, true);
            if (is_array($addressIds)) {
                return Address::whereIn('id', $addressIds)->get();
            }

        if (!empty($addressIds)) {
            return Address::whereIn('id', $addressIds)->get();
        }

        return collect([]);
    }

    public function getAddresses()
    {
        $userAddress = $this->user_addresses;
        if ($userAddress) {
            $addressIds = json_decode($userAddress->address_id, true);
            if (is_array($addressIds)) {
                return Address::whereIn('id', $addressIds)->get();
            }
        }
        return collect([]);
    }

    public function shopping_cart()
    {
        return $this->hasOne(Shopping_Cart::class, 'user_id');
    }

    public function user_review()
    {
        return $this->hasOne(User_Review::class, 'user_id');
    }
}
