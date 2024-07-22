<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class User_Payment_Method extends JsonResource
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
            'payment_type_id'=>$this->payment_type_id,
            'provider'=>$this->provider,
            'account_number'=>$this->account_number,
            'expiry_date'=>$this->expiry_date,
            'is_default'=>$this->is_default,
            'created_at'=>$this->created_at,
            'updated_at'=>$this->updated_at
        ];
    }
}
