<?php

namespace App\Models;

use App\Models\Promotion;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;

    protected $table = 'promotions';

    protected $fillable = [
        'id',
        'name',
        'description',
        'discount_rate',
        'start_date',
        'end_date',
        'created_at',
        'updated_at'
    ];

    protected $hidden = [];

    protected $casts = [
        'name',
        'description',
        'discount_rate',
        'start_date',
        'end_date',
        'created_at',
        'updated_at'
    ];

    public function promotion_category(){
        return hasOne(Promotion::class);
    }
}
