<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateShop_OrderRequest extends FormRequest
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
        if(request()->isMethod('PUT'))
        {
            return [
                'user_id'=>'required',
                'payment_method_id'=>'required',
                'shipping_address'=>'required',
                'shipping_method'=>'required',
                'order_total'=>'required',
                'order_status'=>'required',
            ];
        } else
        return [
            'user_id'=>'required',
            'payment_method_id'=>'required',
            'shipping_address'=>'required',
            'shipping_method'=>'required',
            'order_total'=>'required',
            'order_status'=>'required',
        ];
    }

    public function message()
    {
        if(request()->isMethod('PUT'))
        {
            return [
                'user_id.required'=>'User ID is required',
                'payment_method_id.required'=>'Payment Method ID is required',
                'shipping_address.required'=>'Shipping Address is required',
                'shipping_method.required'=>'Shipping MEthod is Required required',
                'order_total.required'=>'Order Total is required required',
                'order_status.required'=>'Order status is required',
            ];
        } else
        return [
            'user_id.required'=>'User ID is required',
            'payment_method_id.required'=>'Payment Method ID is required',
            'shipping_address.required'=>'Shipping Address is required',
            'shipping_method.required'=>'Shipping MEthod is Required required',
            'order_total.required'=>'Order Total is required required',
            'order_status.required'=>'Order status is required',
        ];
    }
}
