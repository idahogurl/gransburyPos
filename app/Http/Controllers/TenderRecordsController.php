<?php
namespace App\Http\Controllers;
use App\Models\TenderRecords;
use App\Models\Orders;

/**
 * Created by PhpStorm.
 * User: rvest
 * Date: 7/16/2015
 * Time: 12:12 AM
 */
class TenderRecordsController extends Controller
{
    public static function create($orderId) {
        $orderNumber = Orders::setOrderNumber($orderId);
        TenderRecords::create($orderId);
        return response()->json($orderNumber);
    }
}