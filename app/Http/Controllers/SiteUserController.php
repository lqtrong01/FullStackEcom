<?php

namespace App\Http\Controllers;

use App\Models\Site_User;
use App\Models\Address;
use App\Models\User_Address;
use App\Models\Shopping_Cart;
use App\Http\Requests\StoreSite_UserRequest;
use App\Http\Requests\UpdateSite_UserRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;

class SiteUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = Site_User::with(['user_addresses', 'shopping_cart.items.product'])->get();

        if ($users->isEmpty()) {
            return response()->json([
                'message' => 'There is no Customer'
            ], 200);
        }

        $users->each(function ($user) {
            $user->addresses = $user->addresses();
        });

        return response()->json([
            'data' => $users,
        ], 200);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            date_default_timezone_set("Asia/Ho_Chi_Minh");
            $datetime = date("h:i:sa");
            $user = Site_User::create([
                'email'=>$request->email??"",
                'name'=>$request->name??"",
                'phone_number'=>$request->phone_number??"",
                'password'=>Hash::make($request->password),
                'created_at'=>$datetime,
                'updated_at'=>$datetime,
                'user_image'=>$request->user_image??"",
                'role'=>$request->role??'user',
            ]);

            $address = Address::create([
                'address_line'=>$request->address??"New Address",
                'city'=>$request->city??"",
                'country_id'=>$request->country_id??"143",
                'created_at'=>$datetime,
                'updated_at'=>$datetime
            ]);
            
            $user_address = User_Address::create([
                'user_id' => $user->id,
                'address_id' => json_encode([$address->id]),
                'is_default' => true,
                'created_at' => $datetime,
                'updated_at' => $datetime
            ]);

            $shopping_cart = Shopping_Cart::create([
                'user_id' => $user->id,
                'created_at' => $datetime,
                'updated_at' => $datetime
            ]);
            
            // $user_review = User_Review::create([]);

            if(!$user||!$user_address||!$address){
                try{
                    $user->delete();
                    $address->delete();
                    $user_address->delete();
                }
                catch(\Ex $ex){

                }
                return response()->json([
                    'message'=>'Wrong created new user'
                ], 500);
            }

            return response()->json([
                'message'=>'User successfully created',
                'data'=>[
                    $user,
                    $user_address,
                    $address
                ]
            ], 201);
            
        }catch(\Ex $ex)
        {
            return response()->json([
                'message'=>'Something is really wrong!'
            ], 500);
        }
    }

    private function saveImage($image)
    {
        // Check if image is valid base64 string
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
            // Take out the base64 encoded text without mime type
            $image = substr($image, strpos($image, ',') + 1);
            // Get file extension
            $type = strtolower($type[1]); // jpg, png, gif

            // Check if file is an image
            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
                throw new \Exception('invalid image type');
            }
            $image = str_replace(' ', '+', $image);
            $image = base64_decode($image);

            if ($image === false) {
                throw new \Exception('base64_decode failed');
            }
        } else {
            throw new \Exception('did not match data URI with image data');
        }

        $dir = 'images/';
        $file = Str::random() . '.' . $type;
        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;
        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }
        file_put_contents($relativePath, $image);

        return $relativePath;
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try{
            $users = Site_User::with(['user_addresses', 'shopping_cart.items.product'])->find($id);
 
            if(!$users){
                return response()->json([
                    'message'=>'User Not Found'
                ], 404);
            }
            $users->addresses = [];
            $users->addresses = $users->addresses();
            
            
            return response()->json(['data'=>$users]
            , 202);
        }catch(\Ex $ex)
        {
            return response()->json([
                'message'=>'Something is really wrong!'
            ],500);
        }
    }

    public function edit(Request $request, $id)
    {
        try {
            date_default_timezone_set("Asia/Ho_Chi_Minh");
            $datetime = date("h:i:sa");
            $newData = $request->input('address');

            $myModel = User_Address::find($id);
            if ($myModel) {
                // Lấy và giải mã dữ liệu JSON hiện có
                $currentData = json_decode($myModel->data, true);

                // Kiểm tra nếu currentData là mảng, sau đó thêm dữ liệu mới vào mảng
                if (is_array($currentData)) {
                    $currentData[] = $newData;
                } else {
                    $currentData = [$newData];
                }

                // Mã hóa lại mảng JSON và lưu lại bản ghi
                $myModel->data = json_encode($currentData);
                $myModel->save();

                return response()->json(['message' => 'Data updated successfully']);
            } else {
                return response()->json(['message' => 'Record not found'], 404);
            }

        }catch(\Ex $ex)
        {
            return response()->json([
                'message'=>'Something is wrong'
            ], 500);
        }
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            Carbon::setLocale('vi');
            $now = Carbon::now('Asia/Ho_Chi_Minh');

            $myModel = Site_User::find($id);
            if ($myModel) {
                $myModel->name = $request['name'];
                $myModel->phone_number = $request['phone_number'];

        
                $userImage = $request->user_image;
                if ($userImage && Str::startsWith($userImage, 'i')) {
                    $myModel->user_image = $userImage;
                } else {
                    $myModel->user_image = $userImage!== null||"" ? $this->saveImage($userImage) : null;
                }
                $myModel->save();

                return response()->json(['message' => 'Data updated successfully'], 202);
            } else {
                return response()->json(['message' => 'Record not found'], 404);
            }

        }catch(\Ex $ex)
        {
            return response()->json([
                'message'=>'Something is wrong'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try{
            $destroy = Site_User::find($id);
            
            if(!$destroy){
                return response()->json([
                    'message'=>'User Not Found'
                ], 404);
            }

            $destroy->delete();

            return response()->json([
                'message'=>'User is successfully Deleted'
            ], 202);
        }catch(\Ex $ex)
        {
            return response()->json([
                'message'=>'Something is really wrong!'
            ],500);
        }
    }

    public function shopping_cart($id){
        try{
            $user = Site_User::with('shopping_cart.items')->find($id);

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }
            $shoppingCart = $user->shoppingCart;
            $cartItems = [];
            // Kiểm tra sự tồn tại của giỏ hàng
            if ($shoppingCart) {
                $cartItems = $shoppingCart->items;
            } else {
                $shoppingCart = null;
                $cartItems = [];
            }
            

            return response()->json([
                'data'=>$user,
            ], 202);
        }catch(\Ex $ex)
        {
            return response()->json([
                'message'=>'Something is really wrong!'
            ],500);
        }
    }
}
