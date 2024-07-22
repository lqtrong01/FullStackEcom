<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class Order_Line extends JsonResource
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
            'product_item_id'=>$this->product_item_id,
            'order_id'=>$this->order_id,
            'qty'=>$this->qty,
            'price'=>$this->price,
            'created_at'=>$this->created_at,
            'updated_at'=>$this->updated_at
        ];
    }
}
