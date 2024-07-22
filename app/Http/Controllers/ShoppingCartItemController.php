<?php

namespace App\Http\Controllers;

use App\Models\Shopping_Cart_Item;
use Illuminate\Http\Request;
use App\Models\Product_Item;
use App\Http\Requests\StoreShopping_Cart_ItemRequest;
use App\Http\Requests\UpdateShopping_Cart_ItemRequest;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ShoppingCartItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StoreShopping_Cart_ItemRequest $request)
    {
        DB::beginTransaction();
        try {
            $qty = intval($request->qty);     
            $datetime = Carbon::now('Asia/Ho_Chi_Minh');
            $product_item = Product_Item::find($request->product_item_id);

            if ($product_item->qty_in_stock >= $qty) {
                $shopping_cart_item = Shopping_Cart_Item::updateOrCreate(
                    [
                        'cart_id' => $request->cart_id,
                        'product_item_id' => $request->product_item_id
                    ],
                    [
                        'qty' => DB::raw('qty + ' . $qty),
                        'product_image' => $request->product_image,
                        'updated_at' => $datetime
                    ]
                );

                $product_item->save();

                DB::commit();

                return response()->json([
                    'message' => 'Shopping Cart Item successfully created or updated'
                ], 201);
            } else {
                return response()->json([
                    'message' => 'Quantity is out of stock'
                ], 403);
            }
        } catch (\Exception $ex) {
            DB::rollBack();
            return response()->json([
                'message' => 'Something is really wrong!',
                'error' => $ex->getMessage()
            ], 500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Shopping_Cart_Item $shopping_Cart_Item)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Shopping_Cart_Item $shopping_Cart_Item)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateShopping_Cart_ItemRequest $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try{
            $cart_item = Shopping_Cart_Item::find($id);

            if(!$cart_item){
                return response()->json([
                    'message'=>'cart Item Not found'
                ], 403);
            }

            $cart_item->delete();

            return response()->json([
                'message'=>'Deleted Cart Item succesfully'
            ], 200);

        }catch(\Ex $ex){
            return response()->json([
                'message'=>'Deleted destroy really wrong in Server'
            ], 500);
        }

    }
}
