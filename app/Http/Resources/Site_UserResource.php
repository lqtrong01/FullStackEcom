<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class Site_User extends JsonResource
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
            'email_address'=>$this->email_address,
            'phone_number'=>$this->phone_number,
            'password'=>$this->password,
            'created_at'=>$this->created_at,
            'updated_at'=>$this->updated_at,
            'email_verified_at'=>$this->email_verified_at,
            'remember_token'=>$this->remember_token,
            'user_image'=>$this->user_image
        ];
    }

}
