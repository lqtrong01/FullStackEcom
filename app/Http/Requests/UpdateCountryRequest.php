<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCountryRequest extends FormRequest
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
        if(request()->isMethod('put')) {
            return [
                'country_name'=>'required',
            ];
        } else {
            return [
                'country_name'=>'required|string',
            ];
        }
    }
     
    public function messages()
    {
        if(request()->isMethod('put')) {
            return [
                'country_name.required'=>'Country Name is required',
            ];
        } else {
            return [
                'country_name.required'=>'Category Name is required',
            ];   
        }
    }
}
