<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class Shop_Order extends JsonResource
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
            'user_id'=>$this->user_id,
            'order_date'=>$this->order_status,
            'payment_method_id'=>$this->payment_method,
            'shipping_address'=>$this->shipping_address,
            'shipping_method'=>$this->shipping_method,
            'order_total'=>$this->order_total,
            'order_status'=>$this->order_status,
            'created_at'=>$this->created_at,
            'updated_at'=>$this->updated_at
        ];
    }
}
