<?php

namespace App\Http\Controllers;

use App\Models\User_Review;
use App\Models\Order_Line;
use App\Models\Product_Item;
use App\Http\Requests\StoreUser_ReviewRequest;
use App\Http\Requests\UpdateUser_ReviewRequest;
use Illuminate\Http\Request;
use Carbon\Carbon;
use DB;

class UserReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $reviews = Order_Line::with(['user_review.user_id'])
            ->whereHas('user_review', function($query) {
                $query->where('is_review', 1);
            })
            ->get();

            // if (!$user_review) {
            //     return response()->json([
            //         'message' => 'There is no Data'
            //     ], 404);
            // }

            return response()->json([
                'data' => $reviews,
                'message'=>'Response successfully'
            ], 202);
            
        } catch (\Exception $ex) {
            return response()->json([
                'message' => 'Something is really wrong!'
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUser_ReviewRequest $request)
    {
        try {
            $datetime = Carbon::now('Asia/Ho_Chi_Minh');
            $user_review = User_Review::create([
                'user_id'=>$request->user_id,
                'ordered_product_id'=>$request->ordered_product_id,
                'rating_value'=>$request->rating_value??0,
                'comment'=>$request->comment??"",
                'created_at'=>$datetime,
                'updated_at'=>$datetime,
            ]);

            if (!$user_review) {
                return response()->json([
                    'message' => 'Created New User Review Fail'
                ], 500);
            }

            return response()->json([
                'data' => $user_review,
                'message' => 'user_review is successfully created'
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
        try {
            // Lấy các order lines với thông tin user review liên quan, chỉ lấy những object đã đánh giá
            $order_lines = Order_Line::with(['user_review.user_id'])
                                    ->where('product_item_id', $id)
                                    ->whereHas('user_review', function($query) {
                                        $query->where('is_review', 1);
                                    })
                                    ->get();

            // Kiểm tra nếu không có bản ghi nào được trả về
            // if ($order_lines->isEmpty()) {
            //     return response()->json([
            //         'message' => 'Not Found'
            //     ], 404);
            // }

            // Trả về dữ liệu order lines
            return response()->json([
                'data' => $order_lines,
            ], 200);
        } catch (\Exception $ex) {
            return response()->json([
                'message' => 'Something went really wrong!'
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUser_ReviewRequest $request, $product_item_id)
    {
        try {
            DB::beginTransaction();
            $datetime = Carbon::now('Asia/Ho_Chi_Minh');

            // Tìm bản ghi user_review đầu tiên theo user_id và product_id
            $user_review = User_Review::with(['order_line'])
                              ->where('user_id', $request->user_id)
                              ->whereHas('order_line', function ($query) use ($product_item_id) {
                                  $query->where('product_item_id', $product_item_id);
                              })
                              ->firstOrFail();
            
            
            
            // Cập nhật thông tin review
            $user_review->rating_value = $request->rating_value;
            $user_review->comment = $request->comment;
            $user_review->updated_at = $datetime;
            $user_review->is_review = true;
            $user_review->save();
            $product_item = Product_Item::find($product_item_id);
            if ($product_item) {
                // Get all ratings for the product item where is_review is true
                $total_rating = User_Review::where('is_review', true)
                                ->whereHas('order_line', function ($query) use ($product_item_id) {
                                    $query->where('product_item_id', $product_item_id);
                                })
                                ->sum('rating_value');

                // Count all reviews for the product item where is_review is true
                $total_reviews = User_Review::where('is_review', true)
                                ->whereHas('order_line', function ($query) use ($product_item_id) {
                                    $query->where('product_item_id', $product_item_id);
                                })
                                ->count();

            //     // Calculate the new average rating
                $average_rating = $total_reviews > 0 ? $total_rating / $total_reviews : 0;
                $product_item->rating = $average_rating;
                $product_item->save();
            }
            DB::commit();
            return response()->json([
                'data' => $user_review,
                'message' => 'User review successfully updated'
            ], 200);
        } catch (\Exception $ex) {
            return response()->json([
                
                'message' => 'Something went really wrong!'
            ], 500);
        }
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $product_item_id)
    {
        try {
            DB::beginTransaction();
            $datetime = Carbon::now('Asia/Ho_Chi_Minh');

            // Tìm bản ghi user_review đầu tiên theo user_id và product_id
            $user_review = User_Review::with(['order_line'])
                              ->where('user_id', $request['user_id'])
                              ->whereHas('order_line', function ($query) use ($product_item_id) {
                                  $query->where('product_item_id', $product_item_id);
                              })
                              ->firstOrFail();
            
            // Cập nhật thông tin review
            $user_review->is_review = false;
            $user_review->updated_at = $datetime;
            
            // Update the user review
            $user_review->save();
            
            
            DB::commit();
            return response()->json([
                'message' => 'User review successfully updated'
            ], 200);
        } catch (\Exception $ex) {
            return response()->json([
                'id'=>$product_item_id,
                'data'=>$request,
                'message' => 'Something went really wrong!'
            ], 500);
        }
    }
}
