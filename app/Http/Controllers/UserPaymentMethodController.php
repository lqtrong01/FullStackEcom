<?php

namespace App\Http\Controllers;

use App\Models\User_Payment_Method;
use App\Http\Requests\StoreUser_Payment_MethodRequest;
use App\Http\Requests\UpdateUser_Payment_MethodRequest;

class UserPaymentMethodController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUser_Payment_MethodRequest $request)
    {
        try {
            $datetime = Carbon::now('Asia/Ho_Chi_Minh');
            $user_payment_method = User_Payment_Method::create([
                'user_id'=>$request->user_id,
                'payment_type_id'=>$request->payment_type_id,
                'provider'=>$request->provider,
                'expiry_date'=>$request->expiry_date,
                'is_default'=>$request->is_default
            ]);

            if (!$user_payment_method) {
                return response()->json([
                    'message' => 'Created New User Review Fail'
                ], 500);
            }

            return response()->json([
                'data' => $user_payment_method,
                'message' => 'user_payment_method is successfully created'
            ], 202);
        } catch (\Exception $ex) {
            return response()->json([
                'message' => 'Something is really wrong!'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try
        {
            $user_payment_method = User_Payment_Method::where('user_id', $id)->first();
            if(!$user_payment_method){
                return response()->json([
                    'message'=>'User Not Found'
                ],404);
            }
            
            return response()->json([
                'data'=>$user_payment_method
            ]);
        }catch(\Ex $ex){
            return response()->json(['message'=>'Something is really wrong!'],500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUser_Payment_MethodRequest $request,$id)
    {
        try {
            $datetime = Carbon::now('Asia/Ho_Chi_Minh');
            $user_payment_method = User_Payment_Method::where('user_id', $id)->first();

            if (!$user_payment_method) {
                return response()->json([
                    'message' => 'User Not Found'
                ], 404);
            }

            $user_payment_method->payment_type_id = $request->payment_type_id;
            $user_payment_method->provider = $request->provider;
            $user_payment_method->account_number = $request->account_number;
            $user_payment_method->expiry_date = $request->expiry_date;
            $user_payment_method->is_default = $request->is_default;
            $user_payment_method->updated_at = $datetime;
            $user_payment_method->save();

            return response()->json([
                'data' => $user_payment_method,
                'message' => 'user_payment_method is successfully created'
            ], 202);
        } catch (\Exception $ex) {
            return response()->json([
                'message' => 'Something is really wrong!'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try
        {
            $user_payment_method = User_Payment_Method::where('user_id', $id)->first();
            if(!$user_payment_method){
                return response()->json([
                    'message'=>'User Not Found'
                ],404);
            }
            $user_payment_method->delete();
            return response()->json([
                'message'=>'User successfully deleted'
            ]);
        }catch(\Ex $ex){
            return response()->json(['message'=>'Something is really wrong!'],500);
        }
    }
}
