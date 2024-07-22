<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Variation;
use App\Models\Product_Configuration;

class Variation_Opition extends Model
{
    use HasFactory;

    protected $table = 'variation_opitions';

    protected $fillable = [
        'variation_id',
        'value',
    ];

    public function variation()
    {
        return $this->belongsTo(Variation::class);
    }
}
