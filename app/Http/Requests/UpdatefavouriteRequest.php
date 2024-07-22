<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatefavouriteRequest extends FormRequest
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
                'product_id'=>'required',
            ];
        } else
        return [
            'user_id'=>'required|integer',
            'product_id'=>'required|integer',
        ];
    }

    public function message()
    {
        if(request()->isMethod('PUT')){
            return [
                'user_id.required'=>'User Id is required',
                'product_id'=>'Product ID is required',
            ];
        } else
        return [
            'user_id.required'=>'User ID is integer type',
            'product_id.required'=>'Product Id is integer type',
        ];
    }
}
