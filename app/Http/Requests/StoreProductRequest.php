<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class StoreProductRequest extends FormRequest
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
        if(request()->isMethod('post')) {
            return [
                'category_id'=>'required|integer',
                'name' => 'required|string|max:258',
                'description' => 'required|string',
                'product_image' => 'required|string'
            ];
        } else {
            return [
                'category_id'=>'required|integer',
                'name' => 'required|string|max:258',
                'description' => 'required|string',
                'product_image' => 'required|string'
            ];
        }
    }
     
    public function messages()
    {
        if(request()->isMethod('post')) {
            return [
                'category_id.required'=>'Category ID is required',
                'name.required' => 'Name is required!',
                'description.required' => 'Email is required!',
                'product_image.required' => 'password is required!'
            ];
        } else {
            return [
                'category_id.required'=>'Category ID is required',
                'name.required' => 'Name is required!',
                'description.required' => 'Email is required!',
                'product_image.required' => 'password is required!'
            ];   
        }
    }
}
