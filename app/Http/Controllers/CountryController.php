<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Http\Requests\StoreCountryRequest;
use App\Http\Requests\UpdateCountryRequest;

class CountryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $country = Country::all();

        return response()->json([
            'data'=>$country
        ], 200);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCountryRequest $request)
    {
        try {
            date_default_timezone_set("Asia/Ho_Chi_Minh");
            $datetime = date("h:i:sa");
            $country = Country::create([
                'country_name'=>$request->country_name,
                'created_at'=>$datetime,
                'updated_at'=>$datetime
            ]);

            if(!$country){
                return response()->json([
                    'message'=>'Wrong created new Country'
                ], 500);
            }

            return response()->json([
                'message'=>'Country successfully created',
                'data'=>$country
            ], 201);
            
        }catch(\Ex $ex)
        {
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
            $country = Country::find($id);
            if(!$country){
                return response()->json([
                    'message'=>'Country Not Found'
                ], 404);
            }

            return response()->json([
                'message'=>'Response successfully',
                'data'=>$country
            ], 200);
            
        }catch(\Ex $ex)
        {
            return response()->json([
                'message'=>'Something is really wrong!'
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCountryRequest $request, $id)
    {
        try {
            date_default_timezone_set("Asia/Ho_Chi_Minh");
            $datetime = date("h:i:sa");
            $country = Country::find($id);

            if(!$country){
                return response()->json([
                    'message'=>'Country Not Found'
                ], 404);
            }

            $country->country_name = $request->country_name;
            $country->updated_at = $datetime;
            $country->save();

            return response()->json([
                'message'=>'User successfully updated',
                'data'=>$country
            ], 200);
            
        }catch(\Ex $ex)
        {
            return response()->json([
                'message'=>'Something is really wrong!'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $country = Country::find($id);

            if(!$country){
                return response()->json([
                    'message'=>'Country Not FOund'
                ], 404);
            }

            return response()->json([
                'message'=>'User successfully deleted',
                'data'=>$country->id
            ], 201);
            
        }catch(\Ex $ex)
        {
            return response()->json([
                'message'=>'Something is really wrong!'
            ], 500);
        }
    }
}
