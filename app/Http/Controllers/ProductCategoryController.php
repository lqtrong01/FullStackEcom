<?php

namespace App\Http\Controllers;

use App\Models\Product_Category;
use App\Http\Requests\StoreProduct_CategoryRequest;
use App\Http\Requests\UpdateProduct_CategoryRequest;
use Illuminate\Http\Request;

class ProductCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $product_category = Product_Category::with('product')->get();

        return response()->json([
            'data'=>$product_category
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
    public function store(StoreProduct_CategoryRequest $request)
    {
        try {
            date_default_timezone_set("Asia/Ho_Chi_Minh");
            $datetime = date("h:i:sa");
            $product_category = Product_Category::create([
                'category_name' => $request->category_name,
                'created_at'=>$datetime,
                'updated_at'=>$datetime
            ]);
            $product_category->parent_category_id = $product_category->id;
            $product_category->save();
            if(!$product_category){
                return response()->json([
                    'message'=>'Product fail created!'
                ], 500);
            }

            return response()->json([
                'data'=>$product_category,
                'message'=>'Category successfully Created'
            ], 200);
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
            $product_category = Product_Category::with('product')->find($id);

            if(!$product_category){
                return response()->json([
                    'message'=>'Product category Not Found'
                ], 404);
            }

            return response()->json([
                'data'=>$product_category
            ], 200);
        }catch(\Ex $ex){
            return response()->json([
                'message'=>'Something is really wrong!'
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProduct_CategoryRequest $request, $id)
    {   
        try {
            date_default_timezone_set("Asia/Ho_Chi_Minh");
            $datetime = date("h:i:sa");
            $product_category = Product_Category::find($id);

            if(!$product_category){
                return response()->json([
                    'message'=>'Product Category Not Found'
                ], 404);
            }
            {
                $product_category->parent_category_id = $id;
                $product_category->category_name = $request->category_name;
                $product_category->updated_at = $datetime;
                $product_category->save();
            }

            return response()->json([
                'data'=>$product_category,
                'message'=>'Category is successfully updated'
            ], 202);
        }catch(\Ex $ex){
            return response()->json([
                'message'=>'Something is really wrong!'
            ], 500);
        }
    }
    public function category(){
        $product_category = Product_Category::all();

        return response()->json([
            'data'=>$product_category
        ]);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $product_category = Product_Category::find($id);

            if(!$product_category){
                return response()->json([
                    'message'=>'Category Not Found'
                ], 404);
            }

            $product_category->delete();

            return response()->json([
                'message'=>'Product is deleted',
                'data'=>$product_category
            ], 200);
        }catch(\Ex $ex){
            return response()->json([
                'message'=>'Something is really wrong!'
            ], 500);
        }
    }
}
