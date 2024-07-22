<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreShipping_MethodRequest extends FormRequest
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
                'name'=>'required|string',
                'price'=>'required'
            ];
        } else

        return [
            'name'=>'required|string',
            'price'=>'required|decimal:2'
        ];
    }

    public function messages()
    {
        if(request()->isMethod('POST')){
            return [
                'name.required'=>'Name is required',
                'price.required'=>'Price is required'
            ];
        } else

        return [
            'name.required'=>'Name is required',
            'price.required'=>'Price is required'
        ];
    }
}
