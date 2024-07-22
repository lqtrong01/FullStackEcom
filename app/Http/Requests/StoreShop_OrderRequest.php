<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreShop_OrderRequest extends FormRequest
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
                'user_id'=>'required',
                'payment_method_id'=>'required',
                'shipping_address'=>'required',
                'shipping_method'=>'required',
                'order_total'=>'required',
                'order_status'=>'required'
            ];
        } else
        return [
            'user_id'=>'required|integer',
            'payment_method_id'=>'required',
            'shipping_address'=>'required|integer',
            'shipping_method'=>'required|integer',
            'order_total'=>'required|decimal:2',
            'order_status'=>'required|integer'
        ];
    }

    public function messages()
    {
        if(request()->isMethod('POST')){
            return [
                'user_id.required'=>'User ID required',
                'payment_method_id.required'=>'Payment Method ID is required',
                'shipping_address.required'=>'Shipping Address is required',
                'shipping_method.required'=>'Shipping Method is required',
                'order_total.required'=>'Order Total isrequired',
                'order_status.required'=>'Order Status required'
            ];
        } else
        return [
            'user_id.required'=>'User ID required',
            'payment_method_id.required'=>'Payment Method ID is required',
            'shipping_address.required'=>'Shipping Address is required',
            'shipping_method.required'=>'Shipping Method is required',
            'order_total.required'=>'Order Total isrequired',
            'order_status.required'=>'Order Status required'
        ];
    }
}
