<?php

namespace App\Http\Controllers;

use App\Models\Order_Status;
use Illuminate\Http\Request;
use App\Http\Requests\StoreOrder_StatusRequest;
use App\Http\Requests\UpdateOrder_StatusRequest;

class OrderStatusController extends Controller
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
    public function store(StoreOrder_StatusRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Order_Status $order_Status)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order_Status $order_Status)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrder_StatusRequest $request, Order_Status $order_Status)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order_Status $order_Status)
    {
        //
    }
}
