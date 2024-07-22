<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreSite_UserRequest extends FormRequest
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
    public function rules()
    {
        return [
            'name' => 'required|string',
            'email' => 'required|email|string|unique:users,email',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->mixedCase()->numbers()->symbols()
            ]
        ];
    }
    
    public function messages():array
    {
        return [
            'name.required'=>'Name is required',
            'email.required'=>'Email is required',
            'email.unique:users'=>'Email un type Email @...com',
            'password.required'=>'Password is required',
            'password.confirmed'=>'Password is not equalTo passwordconfirmation',
            'password.min'=>'Password must not below 8 characters and had some symbols'
        ];
    }
}
