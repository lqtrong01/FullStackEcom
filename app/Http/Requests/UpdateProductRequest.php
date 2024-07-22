<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
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
        if(request()->isMethod('PUT')){
            return [
                'category_id'=>'required',
                'price'=>'required',
                'qty_in_stock'=>'required',
                'name'=>'required',
                'description'=>'required|string',
                'type'=>'required|string',
                'product_image'=>'required|string'
            ];
        }
        else {
            return [
                'category_id'=>'required|integer',
                'price'=>'required|decimal:2',
                'qty_in_stock'=>'required|integer',
                'name'=>'required|string',
                'type'=>'required|string',
                'description'=>'required|string',
                'product_image'=>'required|string'
            ];
        }
    }

    public function messages () :array 
    {
        if(request()->isMethod('PUT')){
            return [
                'category_id.required'=>'Category ID is required',
                'price.required'=>'Price is required',
                'qty_in_stock.required'=>'Qty is required',
                'name.required'=>'Name is required',
                'description.required'=>'Description is required',
                'type.required'=>'Type is required',
                'product_image.required'=>'Product Image is required'
            ];
        }
        else {
            return [
                'category_id.required'=>'Category ID is required',
                'price.required'=>'Price is required',
                'qty_in_stock.required'=>'Qty is required',
                'name.required'=>'Name required',
                'description.required'=>'Description is required',
                'type.required'=>'Type is required',
                'product_image.required'=>'Product Image is required'
            ];
        }
    }
}
