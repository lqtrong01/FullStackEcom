<?php

namespace App\Http\Controllers;

use App\Models\Shopping_Cart;
use App\Http\Requests\StoreShopping_CartRequest;
use App\Http\Requests\UpdateShopping_CartRequest;

class ShoppingCartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $shopping_cart = Shopping_Cart::with('cart_user')->get();

        return response()->json([
            'data'=>$shopping_cart
        ], 200);
    }

    private function datetime(){
        date_timezone_set('Asia/Ho_Chi_Minh');
        return date('h:i:sa');
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreShopping_CartRequest $request)
    {
        try{
            $shopping_cart = Shopping_Cart::create([
                'user_id'=>$request->user_id,
                'created_at'=>$this->datetime(),
                'updated_at'=>$this->datetime()
            ]);

            if(!$shopping_cart){
                return response()->json([
                    'message'=>'Shopping Cart created failed'
                ],500);
            }
        }
        catch(\Ex $ex){
            return response()->json([
                'message'=>'Something is really wrong!'
            ],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Shopping_Cart $shopping_Cart)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Shopping_Cart $shopping_Cart)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateShopping_CartRequest $request, Shopping_Cart $shopping_Cart)
    {
        try{
            
        }
        catch(\Ex $ex){
            return response()->json([
                'message'=>'Something is really wrong!'
            ],500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try{
            $shopping_cart = Shopping_Cart::where('user_id', $id)->first();

            if(!$shopping_cart){
                return response()->json([
                    'message'=>'Shopping Cart Not Found'
                ], 404);
            }
            $shopping_cart->delete();
            return response()->json([
                'message'=>'Shopping Cart is deleted'
            ], 202);
        }
        catch(\Ex $ex){
            return response()->json([
                'message'=>'Something is really wrong!'
            ],500);
        }
    }
}
