<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrder_LineRequest extends FormRequest
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
                'product_item_id'=>'required',
                'order_id'=>'required',
                'qty'=>'required',
                'price'=>'required',
            ];
        } else
        return [
            'product_item_id',
            'order_id',
            'qty',
            'price',
        ];
    }
}
