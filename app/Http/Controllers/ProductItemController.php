<?php

namespace App\Http\Controllers;

use App\Models\Product_Item;
use App\Http\Requests\StoreProduct_ItemRequest;
use App\Http\Requests\UpdateProduct_ItemRequest;

class ProductItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product_Item::all();

        return response()->json([
            'data'=>$products
        ],200);
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
    public function store(StoreProduct_ItemRequest $request)
    {
        try {
            date_default_timezone_set("Asia/Ho_Chi_Minh");
            $datetime = date("h:i:sa");

            $product_item = Product_Item::create([
                'product_id'=>$request->product_id,
                'SKU'=>$request->SKU,
                'qty_in_stock'=>$request->qty_in_stock,
                'product_image'=>$request->product_image,
                'price'=>$request->price,
                'created_at'=>$datetime,
                'updated_at'=>$datetime
            ]);

            if(!$product_item){
                return response()->json([
                    'message'=>'Product Not Found'
                ], 404);
            }

            return response()->json([
                'message'=>'Product Item successfully created',
                'data'=>$product_item
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
    public function show($id)
    {
        try {
            $product_item = Product_Item::find($id);

            if(!$product_item){
                return response()->json([
                    'message'=>'Product Item Not Found'
                ], 404);
            }

            return response()->json([
                'data'=>$product_item
            ], 200);
        }catch(\Ex $ex){
            return response()->json([
                'message'=>'Something is really wrong!'
            ], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product_Item $product_Item)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProduct_ItemRequest $request, $id)
    {
        try {
            $product_item = Product_Item::find($id);

            if(!$product_item){
                return response()->json([
                    'message'=>'Product Item Not Found'
                ], 404);
            }
            date_default_timezone_set("Asia/Ho_Chi_Minh");
            $datetime = date("h:i:sa");

            {
                $product_item->product_id = $request->product_id;
                $product_item->SKU = $request->SKU;
                $product_item->qty_in_stock = $request->qty_in_stock;
                $product_item->product_image = $request->product_image;
                $product_item->price = $request->price;
                $product_item->updated_at = $datetime;
            }
            $product_item->save();

            return response()->json([
                'data'=>$product_item,
                'message'=>'Product item successfully updated'
            ], 202);
        }catch(\Ex $ex){
            return response()->json([
                'message'=>'Something is really wrong!'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product_Item $product_Item)
    {
        //
    }
}
