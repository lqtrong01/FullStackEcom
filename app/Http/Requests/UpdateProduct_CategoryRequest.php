<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProduct_CategoryRequest extends FormRequest
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
                // 'parent_category_id'=>'required',
                'category_name'=>'required',
            ];
        }
        else {
            return [
                // 'parent_category_id'=>'required|integer',
                'category_name'=>'required|string',
            ];
        }
    }
    public function messages () :array 
    {
        if(request()->isMethod('PUT')){
            return [
                // 'parent_category_id.required'=>'Category ID is required',
                'category_name.required'=>'Name required',
            ];
        }
        else {
            return [
                // 'parent_category_id.required'=>'Category ID is required',
                'category_name.required'=>'Name required',
            ];
        }
    }
}
