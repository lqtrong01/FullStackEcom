<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'category_id'=>$this->category,
            'name'=>$this->name,
            'description'=>$this->description,
            'product_image'=>$this->product_image,
            'created_at'=>$this->created_at,
            'updated_at'=>$this->updated_at
        ];
    }
}