<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\Site_User;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\Models\User_Address;
use App\Models\Address;
use App\Models\Shopping_Cart;

class AuthController extends Controller
{
    public function signup(SignupRequest $request)
    {
        try{
            date_default_timezone_set("Asia/Ho_Chi_Minh");
            $datetime = date("h:i:sa");
            // Create the user with request data
            $user = Site_User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role'=>'User',
                'created_at' => $datetime,
                'updated_at' => $datetime
            ]);

            // Create the user address
            $user_address = User_Address::create([
                'id'=>$user->id,
                'user_id' => $user->id,
                'address_id' => '[]',
                'created_at' => $datetime,
                'updated_at' => $datetime
            ]);

            $shopping_cart = Shopping_Cart::create([
                'id'=>$user->id,
                'user_id' => $user->id,
                'created_at' => $datetime,
                'updated_at' => $datetime
            ]);
            
            // Create a token for the user
            $token = $user->createToken('main')->plainTextToken;

            // Return the response with user and token
            return response()->json([
                'id' => $user->id,
                'user'=> $user,
                'token' => $token
            ], 201);
        }catch (\Ex $ex){
            return response()->json([
                'message'=>'Something reallly wrong when you created new user'
            ], 500);
        }
        
    }


    public function login(LoginRequest $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Site_User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Invalid email or password'], 422);
        }

        $token = $user->createToken('main')->plainTextToken;

        return response()->json([
            'id' => $user->id,
            'user'=> $user,
            'token' => $token,
            'statusCode'=>202
        ], 202);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();

        return response()->json(['success' => true]);
    }

    public function me(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }
}