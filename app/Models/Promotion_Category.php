<?php

namespace App\Models;

use App\Models\Promotion;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion_Category extends Model
{
    use HasFactory;

    protected $table = 'promotion_categories';

    protected $fillable = [
        'category_id',
        'promotion_id',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'category_id'=>'integer',
        'promotion_id'=>'integer',
        'created_at'=>'datetime',
        'updated_at'=>'datetime'
    ];

    public function promotion(){
        return beLongsTo(Promotion::class);
    }
}
