<?php

namespace App\Http\Controllers;

use App\Models\Shop_Order;
use App\Models\User_Review;
use App\Models\Order_Line;
use Illuminate\Http\Request;
use App\Models\Shipping_Method;
use App\Models\Order_Status;
use App\Models\Shopping_Cart_Item;
use App\Models\Product_Item;
use Carbon\Carbon;
use App\Http\Requests\StoreShop_OrderRequest;
use App\Http\Requests\UpdateShop_OrderRequest;
use DB;


class ShopOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $shop_order = Shop_Order::with(['order_lines.user_review', 'order_statuses', 'shipping_methods','shipping_addresses','payment_method_ids'])->get();

            return response()->json([
                'data'=>$shop_order
            ], 200);
        }
        catch(\Ex $ex){
            return response()->json([
                'message'=>'Error Response get Shop Order'
            ],500);
        }
    }

    public function view()
    {
        try{
            $shop_order = Shop_Order::with(['order_lines.user_review', 'user_id','order_statuses', 'shipping_methods','shipping_addresses','payment_method_ids'])->get();

            return response()->json([
                'data'=>$shop_order,
                'message'=>'NUll'
            ], 200);
        }
        catch(\Ex $ex){
            return response()->json([
                'message'=>'Error Response get Shop Order'
            ],500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try{
            Carbon::setLocale('vi');
            $now = Carbon::now('Asia/Ho_Chi_Minh');

            $validated = $request->validate([
                'user_id' => 'required|integer',
                'order_lines' => 'required|array',
                'order_lines.*.product_item_id' => 'required|integer|',
                'order_lines.*.qty' => 'required|integer|min:1',
                'order_lines.*.id' => 'required|integer|min:1',
                'reviews' => 'nullable|array',
                'reviews.*.product_item_id' => 'required_with:reviews|integer|exists:product_items,id',
                'reviews.*.rating' => 'required_with:reviews|integer|min:1|max:5',
                'order_lines.*.price' => 'required|numeric',
                'reviews.*.comment' => 'nullable|string|max:255',
                'payment_method_id'=>'required|integer',
                'shipping_address'=>'required|integer',
                'shipping_method'=>'required|integer',
                'order_status'=>'required|integer',
                'order_total'=>'required|integer',
            ]);
    
            // Create the Shop Order
            $shop_order = Shop_Order::create([
                'user_id' => $validated['user_id'],
                'order_date'=>$now,
                'payment_method_id'=>$validated['payment_method_id'],
                'shipping_address'=>$validated['shipping_address'],
                'shipping_method'=>$validated['shipping_method'],
                'order_total'=>$validated['order_total'],
                'order_status'=>$validated['order_status'],
                'created_at'=>$now,
                'updated_at'=>$now
                // Add other necessary fields
            ]);
    
            // Create Order Lines
            foreach ($validated['order_lines'] as $orderLine) {
                $orderLineRecord = Order_Line::create([
                    'product_item_id' => $orderLine['product_item_id'],
                    'order_id' => $shop_order->id,
                    'qty' => $orderLine['qty'],
                    'price' => $orderLine['price'],
                    'created_at' => $now,
                    'updated_at' => $now
                ]);
    
                if ($orderLineRecord) {
                    User_Review::create([
                        'user_id' => $validated['user_id'],
                        'ordered_product_id' => $orderLineRecord->id,
                        'rating_value' => 0,
                        'comment' => "",
                        'created_at' => $now,
                        'updated_at' => $now
                    ]);
                }
                $product_item = Product_Item::find($orderLine['product_item_id']);
                $product_item->qty_in_stock -= $orderLine['qty'];
                $product_item->save(); 
                $cart_item = Shopping_Cart_Item::find($orderLine['id']);
                $cart_item->delete();
                
            }
    
            // Create User Reviews (if provided)

            return response()->json([
                'data' => $shop_order,
                'message' => 'Shop Order created successfully'
            ], 200);
        }
        catch(\Ex $ex){
            return response()->json([
                'message'=>'Error Response get Shop Order'
            ],500);
        }
    }
    public function show_order($orderID){
        $order = Shop_Order::with(['order_lines.product','order_lines.user_review', 'order_statuses', 'shipping_methods','shipping_addresses','payment_method_ids'])->find($orderID);

        return response()->json([
            'data'=>$order
        ], 200);
    }
    public function order_web($id)
    {
        try{
            $shop_order = Shop_Order::with(['order_lines.product','order_lines.user_review', 'order_statuses', 'shipping_methods','shipping_addresses','payment_method_ids'])->where('user_id', $id)->get();

            return response()->json([
                'data'=>$shop_order
            ], 200);
        }
        catch(\Ex $ex){
            return response()->json([
                'message'=>'Error Response get Shop Order'
            ],500);
        }
    }
    public function transaction_chart (){
        try{
            $shop_order = Shop_Order::all();

            return response()->json([
                'data'=>$shop_order,
                'message'=>'Admin'
            ], 200);
        }
        catch(\Ex $ex){
            return response()->json([
                'message'=>'Error Response get Shop Order'
            ],500);
        }
    }
    
    public function transaction(){
        try{
            $shop_order = Shop_Order::with(['order_lines.user_review', 'user_id','order_statuses', 'shipping_methods','shipping_addresses','payment_method_ids'])->where('order_status', 5)->get();

            return response()->json([
                'data'=>$shop_order,
                'message'=>'Admin'
            ], 200);
        }
        catch(\Ex $ex){
            return response()->json([
                'message'=>'Error Response get Shop Order'
            ],500);
        }
    }
    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try{
            $shop_order = Shop_Order::with(['order_lines.user_review', 'order_statuses', 'shipping_methods','shipping_addresses','payment_method_ids'])->where('user_id', $id)->get();

            return response()->json([
                'data'=>$shop_order
            ], 200);
        }
        catch(\Ex $ex){
            return response()->json([
                'message'=>'Error Response get Shop Order'
            ],500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try{
            DB::beginTransaction();
            $validated = $request->validate([
                'order_status'=>'required|integer',
            ]);

            $order = Shop_Order::find($id);
            Carbon::setLocale('vi');
            $now = Carbon::now('Asia/Ho_Chi_Minh');

            if(!$order){
                return response()->json([
                    'message'=>'Order Not Found!'
                ], 404);
            }

            if($order->order_status === 2 && $validated['order_status']===4){
                return response()->json([
                    'message'=>'Order Cannot updated!'
                ], 403);
            }
            $order_lines = Order_Line::where('order_id', $id)->get();
            if ($validated['order_status'] === 2) {
                foreach ($order_lines as $order_line) {
                    $product_item = Product_Item::find($order_line->product_item_id);
                    if ($product_item) {
                        // Check if there is enough stock
                        if ($product_item->qty_in_stock < $order_line->qty) {
                            DB::rollBack();
                            return response()->json([
                                'message' => 'Insufficient stock for product ID: ' . $product_item->id
                            ], 400);
                        }
                        // Reduce stock quantity
                        $product_item->qty_in_stock -= $order_line->qty;
                        $product_item->SKU += $order_line->qty;
                        $product_item->save();
                    }
                }
            }
    
            // Update the order status and timestamp
            $order->order_status = $validated['order_status'];
            $order->updated_at = $now;
            $order->save();
    
            DB::commit();
    
            return response()->json([
                'message' => 'Order successfully updated'
            ], 200);
        } catch (\Exception $ex) {
            DB::rollBack();
            // Catch the generic exception and return an error response
            return response()->json([
                'message' => 'Update Order really wrong something!'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Shop_Order $shop_Order)
    {
        //
    }
}
