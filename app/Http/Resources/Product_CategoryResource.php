<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class Product_Category extends JsonResource
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
            'parent_category_id'=>$this->parent_category_id,
            'category_name'=>$this->category_name,
            'created_at'=>$this->created_at,
            'updated_at'=>$this->updated_at
        ];
    }
}
