<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProduct_ItemRequest extends FormRequest
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
        if(request()->isMethod('put')){
            return [
                'product_id'=>'required|integer',
                'SKU'=>'required|string',
                'qty_in_stock'=>'required|integer',
                'product_image'=>'required|string',
                'price'=>'required|decimal:2',
            ];
        }

        return [
            'product_id'=>'required|integer',
            'SKU'=>'required|string',
            'qty_in_stock'=>'required|integer',
            'product_image'=>'required|string',
            'price'=>'required|decimal:2'
        ];
    }

    public function messages()
    {
        if(request()->isMethod('put')){
            return [
                'product_id.required'=>'Product ID is required|integer',
                'SKU.required'=>'Sku is required|string',
                'qty_in_stock.required'=>'Quantity In Stock is required|integer',
                'product_image.required'=>'Image Product is required|string',
                'price.required'=>'Price required|decimal:2'
            ];
        }
        
        return [
            'product_id.required'=>'Product ID is required|integer',
            'SKU.required'=>'Sku is required|string',
            'qty_in_stock.required'=>'Quantity In Stock is required|integer',
            'product_image.required'=>'Image Product is required|string',
            'price.required'=>'Price required|decimal:2'
        ];
    }
}
