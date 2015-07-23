<?php
namespace App\Http\Controllers;

use App\Models\OrderLineItems;
use App\Models\Orders;

/**
 * Created by PhpStorm.
 * User: rvest
 * Date: 6/21/2015
 * Time: 7:41 PM
 */
class OrdersController extends Controller
{

    public static function all()
    {
        $orders = Orders::all();
        
        $keyValueArray = array();

        foreach ($orders as $order) {
            $keyValueArray[$order->orderNumber] = array(
                
                "orderNumber" => $order->orderNumber,
                "timestamp" => $order->timestamp,
                "subTotal" => $order->subTotal,
                "taxTotal" => $order->taxTotal,
                "grandTotal" => $order->grandTotal,
                "status" => OrdersController::getStatus($order->orderNumber, $order->amountTendered)

            );
        }

        return response()->json($keyValueArray);
    }

    private static function getStatus($orderNumber, $amountTendered)
    {
        if ($orderNumber == null) {
            return "In Progress";
        }
        if ($amountTendered == null) {
            return "Unpaid";
        }
        return "Paid";
    }

    public function getItems($orderNumber)
    {

        $orderItems = OrderLineItems::all($orderNumber);

        $keyValueArray = array();

        foreach ($orderItems as $orderItem) {
            $keyValueArray[$orderItem->itemId] = array(
                "itemId" => $orderItem->itemId,
                "itemName" => $orderItem->name,
                "price" => $orderItem->price,
                "qty" => $orderItem->qty,
                "extendedPrice" => $orderItem->extendedPrice

            );
        }

        return response()->json($keyValueArray);
    }

    public static function save()
    {
        $orderNumber = Orders::save();
    }

    public static function addItem()
    {
        OrderLineItems::create();
    }

    public static function updateQty()
    {
        OrderLineItems::updateQty();
        Orders::save();
    }

}