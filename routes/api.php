<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductItemController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\SiteUserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\ShoppingCartController;
use App\Http\Controllers\ShippingMethodController;
use App\Http\Controllers\ShoppingCartItemController;
use App\Http\Controllers\ShopOrderController;
use App\Http\Controllers\OrderLineController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\UserReviewController;
use App\Http\Controllers\FavouriteController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentTypeController;
use App\Models\Type_Product;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);


Route::prefix('product_category')->group(function(){
    Route::get('/',[ProductCategoryController::class, 'index']);
    Route::get('/{id}',[ProductCategoryController::class, 'show']);
    Route::put('/{id}', [ProductCategoryController::class, 'update']);
    Route::post('/',[ProductCategoryController::class, 'store']);
    Route::delete('/{id}',[ProductCategoryController::class, 'destroy']);
});
Route::get('/category', [ProductCategoryController::class, 'category']);

Route::prefix('review')->group(function(){
    Route::get('/', [UserReviewController::class, 'index']);
    Route::get('/{id}', [UserReviewController::class, 'show']);
    Route::put('/{id}', [UserReviewController::class, 'update']);
    Route::delete('/{product_item_id}', [UserReviewController::class, 'destroy']);
});

Route::prefix('product')->group(function(){
    Route::get('/',[ProductController::class, 'index']);
    Route::post('/',[ProductController::class, 'store']);
    Route::put('/{id}',[ProductController::class, 'update']);
    Route::delete('/{id}', [ProductController::class, 'destroy']);
    Route::get('/{id}',[ProductController::class, 'show']);
    Route::get('/{id}/transform', [ProductController::class, 'transformProductConfigurations']);
});

Route::prefix('product_item')->group(function(){
    Route::get('/',[ProductItemController::class, 'index']);
    Route::get('/{id}',[ProductItemController::class, 'show']);
    Route::post('/',[ProductItemController::class, 'store']);
    Route::put('/{id}',[ProductItemController::class, 'update']);
    Route::delete('/{id}',[ProductItemController::class, 'destroy']);
});

Route::prefix('user')->group(function(){
    Route::get('/', [SiteUserController::class, 'index']);
    Route::get('/{id}', [SiteUserController::class, 'show']);
    Route::post('/', [SiteUserController::class, 'store']);
    Route::put('/{id}', [SiteUserController::class, 'update']);
    Route::delete('/{id}', [SiteUserController::class, 'destroy']);
    Route::post('/{id}/edit', [SiteUserController::class. 'edit']);
    Route::get('/{id}/cart', [SiteUserController::class, 'shopping_cart']);
    Route::post('/address/{id}', [AddressController::class, 'store']);
    Route::put('/address/{userID}/{id}', [AddressController::class, 'update']);
    Route::delete('/address/{userID}',[AddressController::class, 'destroy']);
    Route::put('/favourite/{userID}', [FavouriteController::class, 'store']);
    Route::get('/favourite/{userID}', [FavouriteController::class, 'show']);
});

Route::prefix('order')->group(function(){
    Route::get('/', [ShopOrderController::class, 'index']);
    Route::put('/{id}', [ShopOrderController::class, 'update']);
    Route::get('/admin', [ShopOrderController::class, 'view']);
    Route::get('/{id}', [ShopOrderController::class, 'show']);
    Route::post('/', [ShopOrderController::class, 'store']);
    Route::get('/{id}/web',[ShopOrderController::class, 'order_web']);
    Route::get('/{orderID}/show_order', [ShopOrderController::class, 'show_order']);
    Route::get('/transaction/admin', [ShopOrderController::class, 'transaction']);
    Route::get('/chart/transaction_chart',[ShopOrderController::class, 'transaction_chart']);
});

Route::prefix('promotion')->group(function(){
    Route::get('/', [PromotionController::class, 'index']);
    Route::get('/{id}', [PromotionController::class, 'show']);
    Route::post('/', [PromotionController::class, 'store']);
    Route::put('/{id}', [PromotionController::class, 'update']);
    Route::delete('/{id}', [PromotionController::class, 'destroy']);

});

Route::prefix('country')->group(function(){
    Route::get('/', [CountryController::class, 'index']);
    Route::get('/{id}', [CountryController::class, 'show']);
    Route::put('/{id}', [CountryController::class, 'update']);
    Route::post('/', [CountryController::class, 'store']);
    Route::delete('/{id}', [CountryController::class, 'destroy']);
});

Route::prefix('shopping_cart')->group(function(){
    Route::get('/', [ShoppingCartController::class, 'index']);
    Route::post('/user', [ShoppingCartItemController::class, 'store']);
    Route::delete('/user/{id}',[ShoppingCartItemController::class, 'destroy']);
});


Route::prefix('shipping_method')->group(function(){
    Route::get('/', [ShippingMethodController::class, 'index']);
    Route::post('/',[ShippingMethodController::class, 'store']);
    Route::put('/{id}', [ShippingMethodController::class, 'update']);
    Route::delete('/{id}', [ShippingMethodController::class, 'destroy']);
});

Route::get('/payment_type', [PaymentTypeController::class, 'index']);
Route::get('/product_types', function () {
    return Type_Product::all();
});

Route::post('/vnpay_payment', [PaymentController::class, 'createPayment']);
Route::get('/vnpay_return', [PaymentController::class, 'vnpayReturn'])->name('vnpay_return');

