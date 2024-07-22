<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product_Item;
use App\Models\Product_Configuration;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;


class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $products = Product::with(['product_item', 'category', 'configurations.variationOption.variation'])->get();

            foreach ($products as $product) {
                $colors = [];
                $sizes = [];
                $storage = [];
                $ram = [];
                $material = [];

                $configurations = $product->configurations;

                foreach ($configurations as $configuration) {
                    $variationOption = $configuration->variationOption;
                    $variation = $variationOption->variation;

                    if (strtolower($variation->name) === 'color') {
                        $colors[] = [
                            'name' => $variationOption->value,
                            'class' => $this->mapColorClass($variationOption->value),
                            'selectedClass' => $this->mapSelectedColorClass($variationOption->value)
                        ];
                    } elseif (strtolower($variation->name) === 'size' && strtolower($product->category->category_name) !== 'smartphone') {
                        $sizes[] = [
                            'name' => $variationOption->value,
                            'inStock' => true // Adjust based on actual stock logic
                        ];
                    } elseif (strtolower($variation->name) === 'storage'){
                        $storage[] = [
                            'name' => $variationOption->value,
                            'inStock' => true // Adjust based on actual stock logic
                        ];
                    } elseif (strtolower($variation->name) === 'ram'){
                        $ram[] = [
                            'name' => $variationOption->value,
                            'inStock' => true // Adjust based on actual stock logic
                        ];
                    } elseif (strtolower($variation->name) === 'material'){
                        $material[] = [
                            'name' => $variationOption->value,
                            'inStock' => true // Adjust based on actual stock logic
                        ];
                    }
                }

                // Remove duplicates
                $colors = array_unique($colors, SORT_REGULAR);
                $sizes = array_unique($sizes, SORT_REGULAR);
                $storage = array_unique($storage, SORT_REGULAR);
                $ram = array_unique($ram, SORT_REGULAR);
                $material = array_unique($material, SORT_REGULAR);

                // Add colors, sizes, and storage to the product
                $product->colors = $colors;
                $product->sizes = $sizes;
                $product->storage = $storage;
                $product->ram = $ram;
                $product->material = $material;
                unset($product->configurations);
            }

            return response()->json([
                'data' => $products,
                'message' => 'Products retrieved successfully.'
            ], 200);
        } catch (\Exception $ex) {
            \Log::error('Error fetching products: ' . $ex->getMessage());
            return response()->json([
                'err'=>$ex,
                'message' => 'Something went really wrong'
            ], 500);
        }

    }

    public function transformProductConfigurations($productId)
    {
        $configurations = Product_Configuration::where('product_item_id', $productId)
            ->with(['variationOption.variation'])
            ->get();
        // dd($configurations);
        if ($configurations->isEmpty()) {
            return response()->json(['error' => 'No configurations found for the specified product item'], 404);
        }
        $product = Product::with(['product_item', 'category'])->find($productId);
        $colors = [];
        $sizes = [];
        $storage = [];

        foreach ($configurations as $configuration) {
            $variationOption = $configuration->variationOption;
            $variation = $variationOption->variation;

            if (strtolower($variation->name) === 'color') {
                $colors[] = [
                    'name' => $variationOption->value,
                    'class' => $this->mapColorClass($variationOption->value),
                    'selectedClass' => $this->mapSelectedColorClass($variationOption->value)
                ];
            } elseif (strtolower($variation->name) === 'size' && $product->category->category_name !== 'smartphone') {
                $sizes[] = [
                    'name' => $variationOption->value,
                    'inStock' => true // Adjust based on actual stock logic
                ];
            } elseif (strtolower($variation->name) === 'storage'){
                $storage[] = [
                    'name' => $variationOption->value,
                    'inStock' => true // Adjust based on actual stock logic
                ];
            }
        }
        
        return response()->json([
            'data'=>$product,
            'colors' => $colors,
            'sizes' => $sizes,
            'storages'=>$storage
        ]);
    }

    private function mapColorClass($color)
    {
        // Map the color value to a CSS class
        switch (strtolower($color)) {
            case 'white':
                return 'bg-white';
            case 'gray':
                return 'bg-gray-200';
            case 'black':
                return 'bg-gray-900';
            case 'blue':
                return 'bg-indigo-600';
            case 'red':
                return 'bg-red-800';
            default:
                return 'bg-default';
        }
    }

    private function mapSelectedColorClass($color)
    {
        // Map the color value to a selected CSS class
        switch (strtolower($color)) {
            case 'white':
                return 'ring-gray-400';
            case 'gray':
                return 'ring-gray-400';
            case 'black':
                return 'ring-gray-900';
            case 'blue':
                return 'ring-indigo-600';
            case 'red':
                return 'ring-red-800';
            default:
                return 'ring-default';
        }
    }

    public function pagniation(Request $request )
    {

        $user = auth()->user(); // Lấy thông tin người dùng đã đăng nhập

        // Kiểm tra nếu người dùng là admin
        if ($user->role === 'admin') {
            // Nếu là admin, lấy tất cả các sản phẩm
            $products = Product::orderBy('created_at', 'desc')->paginate(2);
        } else {
            // Nếu không phải admin, chỉ lấy các sản phẩm của người dùng đó
            $products = Product::where('user_id', $user->id)
                            ->orderBy('created_at', 'desc')
                            ->paginate(2);
        }

        return ProductResource::collection($products);

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
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            date_default_timezone_set("Asia/Ho_Chi_Minh");
            $datetime = date("h:i:sa");

            $product = Product::create([
                'category_id'=>$request->category_id??1,
                'name' => $request->name??"",
                'description' => $request->description??"",
                'product_image' => $this->saveImage($request->product_image)??"",
                'type'=>$request->type??"",
                'created_at'=>$datetime,
                'updated_at'=>$datetime
            ]);

            $product_item = Product_Item::create([
                'id'=>$product->id,
                'product_id'=>($product->id),
                'SKU'=>'0',
                'qty_in_stock'=>0,
                'product_image'=>$this->saveImage($request->product_image)??"",
                'price'=>$request->price,
                'rating'=>'0',
                'created_at'=>$datetime,
                'updated_at'=>$datetime
            ]);
            
            if($product && $product_item){
                return response()->json([
                    'message' => "Product successfully created."
                ],201);
            }

            return response()->json([
                'message' => "Product fail created."
            ],200);
            
        } catch (\Exception $e) {
            // Return Json Response
            return response()->json([
                'message' => "Something went really wrong Created Product!"
            ],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $product = Product::with(['product_item', 'category'])->find($id);

            if(!$product){
                return response()->json([
                    'message'=>'Product Not Found'
                ], 404);
            }

            return response()->json([
                'data'=>$product
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
    public function update(UpdateProductRequest $request, $id)
    {
        try {
            date_default_timezone_set("Asia/Ho_Chi_Minh");
            $datetime = date("h:i:sa");
            $product = Product::find($id);
            $product_item = Product_Item::where('product_id', $id)->first();
            if(!$product && !$product_item){
                return response()->json([
                    'message'=>'Product Not Found'
                ], 404);
            }
            $product->category_id = $request->category_id;
            $product->name = $request->name;
            $product->description = $request->description;
            $product->product_image = $request->product_image;
            $product->type = $request->type;
            $product->updated_at = $datetime;
            
            $product->save();

            $product_item->price = $request->price;
            $product_item->product_image = $product->product_image;
            $product_item->qty_in_stock  = $request->qty_in_stock;
            $product_item->save();
            
            return response()->json([
                'message'=>'Product is successfully updated',
                'data'=>$product
            ], 200);
        }catch(\Ex $ex){
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
            $product = Product::find($id);
            $product_item = Product_Item::where('product_id', $product->id)->first();
            if(!$product){
                return response()->json([
                    'message'=>'Product Not Found'
                ], 404);
            }
            $product_item->delete();
            $product->delete();
            return response()->json([
                'message'=>'Product is deleted',
                'data'=>$product
            ], 200);
        }catch(\Ex $ex){
            return response()->json([
                'message'=>'Something is really wrong!'
            ], 500);
        }
    }
}
