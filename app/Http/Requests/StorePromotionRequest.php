<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePromotionRequest extends FormRequest
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
                'name'=>'required',
                'description'=>'required|string',
                'discount_rate'=>'required|decimal:2',
                'start_date'=>'required|datetime',
                'end_date'=>'required|datetime',
                'created_at'=>'required|datetime',
                'updated_at'=>'required|datetime'
            ];
        }

        return [
            'name'=>'required',
            'description'=>'required|string',
            'discount_rate'=>'required|decimal:2',
            'start_date'=>'required|datetime',
            'end_date'=>'required|datetime',
            'created_at'=>'required|datetime',
            'updated_at'=>'required|datetime'
        ];
    }

    public function messages():array
    {
        if(request()->isMethod('post')){
            return [
                'name.required'=>'Name is required',
                'description.required'=>'Description is required',
                'discount_rate.required'=>'Discount rate is required',
                'start_date.required'=>'Start day is required',
                'end_date.required'=>'End day is required',
                'created_at.required'=>'Created is required|datetime',
                'updated_at.required'=>'Updated is required|datetime'
            ];
        }

        return [
            'name.required'=>'Name is required',
            'description.required'=>'Description is required',
            'discount_rate.required'=>'Discount rate is required',
            'start_date.required'=>'Start day is required',
            'end_date.required'=>'End day is required',
            'created_at.required'=>'Created is required|datetime',
            'updated_at.required'=>'Updated is required|datetime'
        ];
    }
}
