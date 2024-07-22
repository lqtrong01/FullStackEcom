<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUser_ReviewRequest extends FormRequest
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
                'user_id'=>'required|integer',
                'rating_value'=>'required|integer',
                'comment'=>'required|string'
            ];
        } else
        return [
            'user_id'=>'required|integer',
            'rating_value'=>'required|integer',
            'comment'=>'required'
        ];
    }

    public function messages(){
        if(request()->isMethod('PUT')){
            return [
                'user_id.required'=>'User ID is required',
                'rating_value.required'=>'Rating is required',
                'comment.required'=>'Comment is required'
            ];
        } else
        return [
            'user_id.required'=>'User ID is required',
            'rating_value.required'=>'Rating is required',
            'comment.required'=>'Comment is required'
        ];
    }
}
