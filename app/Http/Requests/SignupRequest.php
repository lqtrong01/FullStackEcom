<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class SignupRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'name' => 'required|string',
            'email' => [
                'required',
                'email',
                'string',
                'unique:users,email',
                function ($attribute, $value, $fail) {
                    if (!str_ends_with($value, '@gmail.com')) {
                        $fail('The email must be a valid @gmail.com address.');
                    }
                },
            ],
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->mixedCase()->numbers()->symbols(),
            ],
        ];
    }

    /**
     * Get the custom messages for validator errors.
     *
     * @return array<string, mixed>
     */
    public function messages()
    {
        return [
            'name.required' => 'Name is required',
            'email.required' => 'Email is required',
            'email.email' => 'Invalid email format',
            'email.unique' => 'Email is already taken',
            'password.required' => 'Password is required',
            'password.confirmed' => 'Password confirmation does not match',
            'password.min' => 'Password must be at least 8 characters',
            'password.mixedCase' => 'Password must contain both uppercase and lowercase letters',
            'password.numbers' => 'Password must contain at least one number',
            'password.symbols' => 'Password must contain at least one special character',
        ];
    }
}