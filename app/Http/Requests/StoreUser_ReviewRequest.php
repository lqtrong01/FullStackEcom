<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUser_ReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        if(request()->isMethod('POST')){
            return [
                'user_id'=>'required',
                'ordered_product_id'=>'required',
                'rating_value'=>'required',
                'comment'=>'required'
            ];
        } else
        return [
            'user_id'=>'required|integer',
            'ordered_product_id'=>'required',
            'rating_value'=>'required',
            'comment'=>'required'
        ];
    }

    public function messages(){
        if(request()->isMethod('POST')){
            return [
                'user_id.required'=>'User ID is required',
                'ordered_product_id.required'=>'Order Product ID is required',
                'rating_value.required'=>'Rating is required',
                'comment.required'=>'Comment is required'
            ];
        } else 
        return [
            'user_id.required'=>'User ID is required',
            'ordered_product_id.required'=>'Order Product ID is required',
            'rating_value.required'=>'Rating is required',
            'comment.required'=>'Comment is required'
        ];

    }
}
