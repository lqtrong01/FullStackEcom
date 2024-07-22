<?php

namespace App\Http\Controllers;

use App\Models\favourite;
use App\Http\Requests\StorefavouriteRequest;
use App\Http\Requests\UpdatefavouriteRequest;
use Carbon\Carbon;

class FavouriteController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StorefavouriteRequest $request, $userID)
    {
        try {
            $datetime = Carbon::now('Asia/Ho_Chi_Minh');
            
            $favourite = Favourite::where('user_id', $userID)
                                ->where('product_id', $request->product_id)
                                ->first();
            
            if (!$favourite) {
                $favourite = Favourite::create([
                    'user_id' => $userID,
                    'product_id' => $request->product_id,
                    'is_default' => true,
                    'created_at' => $datetime,
                    'updated_at' => $datetime
                ]);
            } else {
                $favourite->is_default = !$favourite->is_default;
                $favourite->updated_at = $datetime;
                $favourite->save();
            }

            return response()->json([
                'is_default' => $favourite->is_default,
                'product_id' => $request->product_id,
                'message' => 'Favourite successfully created or updated'
            ], 201);
        } catch (\Exception $ex) {
            return response()->json([
                'message' => 'Something went wrong!',
                'error' => $ex->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($userID)
    {
        try
        {
            $favourite = favourite::with('product_id')->where('user_id', $userID)->get();

            // if(!$favourite){
            //     return response()->json([
            //         'There is no favourite'
            //     ], 404);
            // }
            
            return response()->json([
                'data'=>$favourite
            ], 202);
        }catch(\Ex $ex){
            return response()->json([
                'message'=>'Something is really wrong in Delete Favourite'
            ], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(favourite $favourite)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatefavouriteRequest $request, favourite $favourite)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try
        {
            $favourite = favourite::find($id);

            if(!$favourite){
                return response()->json([]);
            }
            $favourite->delete();
            return response()->json([
                'message'=>'Favourite is Deleted'
            ], 202);
        }catch(\Ex $ex){
            return response()->json([
                'message'=>'Something is really wrong in Delete Favourite'
            ], 500);
        }
    }
}
