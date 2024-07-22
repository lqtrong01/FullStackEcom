<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class Product_Item extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'product_id'=>$this->product_id,
            'SKU'=>$this->SKU,
            'qty_in_stock'=>$this->qty_in_stock,
            'product_image'=>$this->product_image,
            'price'=>$this->price,
            'created_at'=>$this->created_at,
            'updated_at'=>$this->updated_at
        ];
    }
}
