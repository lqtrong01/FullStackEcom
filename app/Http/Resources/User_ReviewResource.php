<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class User_Review extends JsonResource
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
            'ordered_product_id'=>$this->ordered_product_id,
            'rating_value'=>$this->rating_value,
            'comment'=>$this->comment,
            'is_review'=>$this->is_review,
            'created_at'=>$this->created_at,
            'updated_at'=>$this->updated_at
        ];
    }
}
