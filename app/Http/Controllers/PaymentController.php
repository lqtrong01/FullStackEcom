<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function createPayment(Request $request)
    {
        try {
            date_default_timezone_set('Asia/Ho_Chi_Minh');

            $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
            $vnp_Returnurl = route('vnpay.return'); // Create a route for the return URL
            $vnp_TmnCode = "NA7GH0VK"; // Mã website tại VNPAY
            $vnp_HashSecret = "2YBL3SAK2K9ROT9BQ07PJRZLP24AYG5Y"; // Chuỗi bí mật

            $vnp_TxnRef = time(); // Unique transaction reference
            $vnp_OrderInfo = 'Thanh Toan Hoa Don';
            $vnp_Amount = $request->input('amount') * 100; // Ensure amount is in smallest unit
            $vnp_Locale = $request->input('language', 'vn'); // Default to 'vn' if not provided
            $vnp_BankCode = $request->input('bank_code', 'VNBANK');
            $vnp_IpAddr = $request->ip();

            $inputData = [
                "vnp_Version" => "2.1.0",
                "vnp_TmnCode" => $vnp_TmnCode,
                "vnp_Amount" => $vnp_Amount,
                "vnp_Command" => "pay",
                "vnp_CreateDate" => date('YmdHis'),
                "vnp_CurrCode" => "VND",
                "vnp_IpAddr" => $vnp_IpAddr,
                "vnp_Locale" => $vnp_Locale,
                "vnp_OrderInfo" => $vnp_OrderInfo,
                "vnp_OrderType" => "billpayment",
                "vnp_ReturnUrl" => $vnp_Returnurl,
                "vnp_TxnRef" => $vnp_TxnRef,
            ];

            if (!empty($vnp_BankCode)) {
                $inputData['vnp_BankCode'] = $vnp_BankCode;
            }

            ksort($inputData);
            $query = "";
            $i = 0;
            $hashdata = "";
            foreach ($inputData as $key => $value) {
                if ($i == 1) {
                    $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
                } else {
                    $hashdata .= urlencode($key) . "=" . urlencode($value);
                    $i = 1;
                }
                $query .= urlencode($key) . "=" . urlencode($value) . '&';
            }

            $vnp_Url = $vnp_Url . "?" . $query;
            if (!empty($vnp_HashSecret)) {
                $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
                $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
            }

            $returnData = [
                'code' => '00',
                'message' => 'success',
                'data' => $vnp_Url
            ];

            if ($request->has('redirect')) {
                return redirect($vnp_Url);
            } else {
                return response()->json($returnData);
            }
        } catch (\Exception $e) {
            \Log::error('Payment creation error: ' . $e->getMessage());
            return response()->json([
                'code' => '99',
                'message' => 'An error occurred',
                'data' => $e->getMessage()
            ], 500);
        }
    }


    public function vnpayReturn(Request $request)
    {
        // Get all returned data from VNPay
        $vnp_SecureHash = $request->input('vnp_SecureHash');
        $inputData = $request->except('vnp_SecureHash');
        unset($inputData['vnp_SecureHash']);
        ksort($inputData);
        $i = 0;
        $hashData = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashData = $hashData . '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData = $hashData . urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }
        $vnp_HashSecret = "2YBL3SAK2K9ROT9BQ07PJRZLP24AYG5Y";
        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        if ($secureHash == $vnp_SecureHash) {
            if ($request->input('vnp_ResponseCode') == '00') {
                // Payment success
                echo "<script>window.opener.postMessage('payment-success', 'http://localhost:5173');</script>";
                echo "<script>window.close();</script>";
            } else {
                // Payment failed
                echo "<script>window.opener.postMessage('payment-failed', 'http://localhost:5173');</script>";
                echo "<script>window.close();</script>";
            }
        } else {
            // Invalid hash
            echo "<script>window.opener.postMessage('payment-failed', 'http://localhost:5173');</script>";
            echo "<script>window.close();</script>";
        }
    }

}
