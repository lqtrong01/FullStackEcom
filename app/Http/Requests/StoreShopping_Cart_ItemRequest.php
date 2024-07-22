<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreShopping_Cart_ItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
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
                'cart_id'=>'required',
                'product_item_id'=>'required',
                'qty'=>'required',
                'product_image'=>'required'
            ];
        } else
        return [
            'cart_id'=>'required|integer',
            'product_item_id'=>'required|integer',
            'qty'=>'required|integer',
            'product_image'=>'required|string'
        ];
    }

    public function messages(){
        if(request()->isMethod('POST')){
            return [
                'cart_id.required'=>'ID Cart is required',
                'product_item_id'=>'Product Item is required',
                'qty'=>'Quantity is required',
                'product_image'=>'Image is required'
            ];
        } else
        return [
            'cart_id.required'=>'ID Cart is required',
            'product_item_id'=>'Product Item is required',
            'qty'=>'Quantity is required',
            'product_image'=>'Image is required'
        ];
    }
}
