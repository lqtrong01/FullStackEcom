<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorefavouriteRequest extends FormRequest
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
                'product_id'=>'required',
                'is_default'=>'required'
            ];
        } else
        return [
            'user_id'=>'required|integer',
            'product_id'=>'required|integer',
        ];
    }

    public function message()
    {
        if(request()->isMethod('POST')){
            return [
                'user_id.required'=>'User Id is required',
                'product_id.required'=>'Product ID is required',
            ];
        } else
        return [
            'user_id.required'=>'User ID is integer type',
            'product_id.required'=>'Product Id is integer type',
        ];
    }

}
