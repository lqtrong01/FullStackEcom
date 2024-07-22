<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUser_Payment_MethodRequest extends FormRequest
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
                'user_id'=>'required',
                'payment_type_id'=>'required',
                'provider'=>'required',
                'account_number'=>'required',
                'expiry_date'=>'required',
                'is_default'=>'required'
            ];
        } else
        return [
            'user_id'=>'required',
            'payment_type_id'=>'required',
            'provider'=>'required',
            'account_number'=>'required',
            'expiry_date'=>'required',
            'is_default'=>'required'
        ];
    }

    public function messages(){
        if(request()->isMethod('PUT')){
            return [
                'user_id.required'=>'ID is required',
                'payment_type_id.required'=>'Payment ID is required',
                'provider.required'=>'Provider is required',
                'account_number.required'=>'Account is required',
                'expiry_date.required'=>'Date is required',
                'is_default.required'=>'Is default is required'
            ];
        } else
        return [
            'user_id.required'=>'ID is required',
            'payment_type_id.required'=>'Payment ID is required',
            'provider.required'=>'Provider is required',
            'account_number.required'=>'Account is required',
            'expiry_date.required'=>'Date is required',
            'is_default.required'=>'Is default is required'
        ];
    }
}
