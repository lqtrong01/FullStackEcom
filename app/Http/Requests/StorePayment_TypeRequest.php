<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePayment_TypeRequest extends FormRequest
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
                'value'=>'required'
            ];
        }else
        return [
            'value'=>'required|string'
        ];
    }

    public function messages(){
        if(request()->isMethod('POST')){
            return [
                'value.required'=>'Value is required'
            ];
        } else
        return ['value.required'=>'Value is required'];
    }
}
