<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateShipping_MethodRequest extends FormRequest
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
                'name'=>'required|string',
                'price'=>'required'
            ];
        } else

        return [
            'name'=>'required|string',
            'price'=>'required|decimal:2'
        ];
    }

    public function messages():array
    {
        if(request()->isMethod('PUT')){
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
