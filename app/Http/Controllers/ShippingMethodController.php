<?php

namespace App\Http\Controllers;

use App\Models\Shipping_Method;
use App\Http\Requests\StoreShipping_MethodRequest;
use App\Http\Requests\UpdateShipping_MethodRequest;

class ShippingMethodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $method = Shipping_Method::all();

        return response()->json([
            'data'=>$method
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreShipping_MethodRequest $request)
    {
        try{
            date_default_timezone_set("Asia/Ho_Chi_Minh");
            $datetime = date("h:i:sa");

            $method = Shipping_Method::create([
                'name'=>$request->name??"",
                'price'=>$request->price??"",
                'created_at'=>$datetime,
                'updated_at'=>$datetime
            ]);

            return response()->json([
                'message'=>'Shipping Method successfully created'
            ], 201);

        }catch(\Ex $ex){
            return response()->json([
                'message'=>'Something is really wrong!'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Shipping_Method $shipping_Method)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateShipping_MethodRequest $request, $id)
    {
        try {
            date_default_timezone_set("Asia/Ho_Chi_Minh");
            $datetime = date("h:i:sa");
            $method = Shipping_Method::find($id);
            if (!$method) {
                return response()->json([
                    'message' => 'Method Not Found'
                ], 404);
            }

            $method->name = $request->name;
            $method->price = $request->price;
            $method->updated_at = $datetime;
            $method->save();

            return response()->json([
                'data' => $method,
                'message' => 'Method is successfully updated'
            ], 202);
        } catch (\Exception $ex) {
            return response()->json([
                'id'=>$id,
                'message' => 'Something is really wrong!'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $method = Shipping_Method::find($id);

            if(!$method){
                return response()->json([
                    'message'=>'Product Category Not Found'
                ], 404);
            }
            {
                $method->delete();
            }

            return response()->json([
                'message'=>'Category is successfully updated'
            ], 202);
        }catch(\Ex $ex){
            return response()->json([
                'message'=>'Something is really wrong!'
            ], 500);
        }
    }
}
