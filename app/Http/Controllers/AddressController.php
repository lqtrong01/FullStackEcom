<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\User_Address;
use Illuminate\Http\Request;
use App\Http\Requests\StoreAddressRequest;
use App\Http\Requests\UpdateAddressRequest;

class AddressController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function store(Request $request, $id)
    {
        date_default_timezone_set("Asia/Ho_Chi_Minh");
        $datetime = date("h:i:sa");
        // Lưu địa chỉ mới vào bảng addresses
        $newAddress = Address::create([
            'address_line' => $request->input('address')??"",
            'country_id'=>143,
            'is_default'=>true,
            'created_at'=>$datetime,
            'updated_at'=>$datetime
        ]);

        // Lấy address_id của địa chỉ mới
        $newAddressId = $newAddress->id;

        // Tìm bản ghi user_address theo user_id
        $userAddress = User_Address::where('user_id', $id)->first();

        // Nếu bản ghi user_address tồn tại
        if ($userAddress) {
            // Giải mã dữ liệu JSON hiện có
            $currentAddressIds = json_decode($userAddress->address_id, true);

            // Kiểm tra nếu currentAddressIds là mảng, sau đó thêm address_id mới vào mảng
            if (is_array($currentAddressIds)) {
                $currentAddressIds[] = $newAddressId;
            } else {
                $currentAddressIds = [$newAddressId];
            }

            // Mã hóa lại mảng JSON và cập nhật bản ghi
            $userAddress->address_id = json_encode($currentAddressIds);
            $userAddress->save();
        } else {
            // Nếu bản ghi user_address không tồn tại, tạo mới với address_id là mảng JSON chứa address_id mới
            User_Address::create([
                'user_id' => $id,
                'address_id' => json_encode([$newAddressId])
            ]);
        }

        return response()->json([
            'message' => 'Address added successfully', 
            'address_id' => $newAddressId
        ],201);
    }


    /**
     * Display the specified resource.
     */
    public function show(Address $address)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Address $address)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $userId, $id)
    {
        // Lấy địa chỉ mới từ request
        $newAddress = $request->input('address');

        // Tìm địa chỉ cần sửa
        $address = Address::find($id);

        if ($address) {
            // Cập nhật địa chỉ mới
            $address->address_line = $newAddress;
            $address->save();

            return response()->json([
                'message' => 'Address updated successfully'
            ]);
        }

        return response()->json([
            'message' => 'Address not found'
        ], 404);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $userId)
    {
        $addressIdToRemove = $request->input('address_id');

        // Tìm bản ghi user_address theo user_id
        $userAddress = User_Address::where('user_id', $userId)->first();

        if ($userAddress) {
            // Giải mã dữ liệu JSON hiện có
            $currentAddressIds = json_decode($userAddress->address_id, true);

            // Kiểm tra nếu currentAddressIds là mảng và loại bỏ address_id cần xóa
            if (is_array($currentAddressIds)) {
                $currentAddressIds = array_filter($currentAddressIds, function($id) use ($addressIdToRemove) {
                    return $id != $addressIdToRemove;
                });

                // Mã hóa lại mảng JSON và cập nhật bản ghi
                $userAddress->address_id = json_encode(array_values($currentAddressIds));
                $userAddress->save();
            }
            return response()->json([
                'id'=> $request->address_id,
                'data'=> $userAddress,
                'message' => 'Address removed successfully'
            ],202);
        }

        return response()->json(['message' => 'Address Not Found'],404);
    }
}
