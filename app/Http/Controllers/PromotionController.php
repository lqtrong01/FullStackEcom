<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use App\Models\Promotion_Category;
use App\Http\Requests\StorePromotionRequest;
use App\Http\Requests\UpdatePromotionRequest;

class PromotionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $promotion = Promotion::with('promotion_category')->get();

        if(!$promotion){
            return response()->json([
                'message'=>'There is no Promotion'
            ], 400);
        }

        return response()->json([
            'data'=>$promotion,
            'message'=>'Promotion response successfully.'
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
    public function store(StorePromotionRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try{
            $promotion = Promotion::find($id);
            if(!$promotion){
                return response()->json([
                    'message'=>'Promotion not found'
                ], 404);
            }

            return response()->json([
                'data'=>$promotion
            ], 200);
        }catch(\Ex $ex){
            return response()->json([
                'message'=>'Promotion Somthing is really wrong@'
            ], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Promotion $promotion)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePromotionRequest $request,$id)
    {
        try
        {
            $promotion = Promotion::find($id);
            if(!$promotion){
                return response()->json([
                    'message'=>'Promotion Not Found'
                ], 404);
            }
            
            {
                $promotion->name = $request->name;
                $promotion->description = $request->description;
                $promotion->start_date = $request->start_date;
                $promotion->end_date = $request->end_date;
                $promotion->created_at = $request->created_at;
                $promotion->updated_at;
                $promotion->save();
            }
            return response()->json([
                'message'=>'Promotion successfully Updated',
                'data'=>$promotion
            ], 202);
        }catch(\Ex $ex)
        {
            return response()->json([
                'message'=>'Something really wrong in Promotion Updated'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Promotion $promotion)
    {
        //
    }
}
