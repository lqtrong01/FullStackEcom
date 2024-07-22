<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Product_Category;
use App\Models\Variation_Opition;

class Variation extends Model
{
    use HasFactory;

    protected $table = 'variations';

    protected $fillable = [
        'category_id',
        'name'
    ];
    
    public function options()
    {
        return $this->hasMany(VariationOption::class);
    }
}
