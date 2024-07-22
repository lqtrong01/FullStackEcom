<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePromotion_CategoryRequest extends FormRequest
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
        if(request()->isMethod('post')){
            return [
                'category_id'=>'required',
                'promotion_id'=>'required'
            ];
        }

        return [
            'category_id'=>'required',
            'promotion_id'=>'required'
        ];
    }

    public function messages(): array 
    {
        if(request()->isMethod('post')){
            return [
                'category_id.required'=>'Category ID is required',
                'promotion_id.required'=>'Promotion ID is required'
            ];
        }

        return [
            'category_id.required'=>'Category ID is required',
            'promotion_id.required'=>'Promotion ID is required'
        ];
    }
}
