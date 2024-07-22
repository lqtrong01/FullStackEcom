<?php

namespace App\Http\Controllers;

use App\Models\Payment_Type;
use App\Http\Requests\StorePayment_TypeRequest;
use App\Http\Requests\UpdatePayment_TypeRequest;

class PaymentTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $payment_type = Payment_Type::all();
        
        return response()->json([
            'data'=>$payment_type
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
    public function store(StorePayment_TypeRequest $request)
    {
        try{
            date_default_timezone_set('Asia/Ho_Chi_Minh');
            $datetime = date('h:i:sa');
            $payment_type = Payment_Type::create([
                'value'=>$request->value,
                'created_at'=>$datetime,
                'updated_at'=>$datetime
            ]);
            if(!$payment_type){
                return response()->json([
                    'message'=>'Payment type created Fail'
                ],500);
            }
            return response()->json([
                'data'=>$payment_type,
                'message'=>'Payment type successfully created'
            ], 201);
        }
        catch(\Ex $ex){
            return response()->json([
                'message'=>'Something is really wrong!'
            ],500);
        }
    }
    private function datetime(){
        date_default_timezone_set('Asia/Ho_Chi_Minh');

        return date("h:i:sa"); 
    }
    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try{
            $payment_type = Payment_Type::find($id);

            if(!$payment_type){
                return response()->json([
                    'message'=>'Payment type Not Found'
                ], 404);
            }
            return response()->json([
                'data'=>$payment_type
            ], 200);
        }
        catch(\Ex $ex){
            return response()->json([
                'message'=>'Something is really wrong!'
            ],500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment_Type $payment_Type)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePayment_TypeRequest $request, $id)
    {
        try{

            $payment_type = Payment_Type::find($id);
            if(!$payment_type){
                return response()->json([
                    'message'=>'Payment type Not Found'                ], 404);
            }

            $payment_type->value = $request->value;
            $payment_type->updated_at = $this->datetime();
            $payment_type->save();

            return response()->json([
                'message'=>'Payment type successfully updated'
            ]);
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
            $payment_type = Payment_Type::find($id);
            if(!$payment_type){
                return response()->json([
                    'message'=>'Payment type Not Found']
                , 404);
            }

            $payment_type->delete();

            return response()->json([
                'message'=>'Payment type successfully deleted'
            ]);

        }
        catch(\Ex $ex){
            return response()->json([
                'message'=>'Something is really wrong!'
            ],500);
        }
    }
}
