<?php
namespace App\Http\Controllers;

use App\Models\OrderLineItems;
use App\Models\Orders;
use Illuminate\Http\Request;

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
            $order->status = OrdersController::getStatus($order->orderNumber, $order->amountTendered);
            $keyValueArray[$order->orderId] = $order;
        }
        return response()->json($keyValueArray);
    }

    private static function getStatus($orderNumber, $amountTendered)
    {
        if (empty($orderNumber)) {
            return "In Progress";
        }
        if (empty($amountTendered)) {
            return "Unpaid";
        }
        return "Paid";
    }

    public function getItems($orderId)
    {

        $orderItems = OrderLineItems::all($orderId);

        $keyValueArray = array();

        foreach ($orderItems as $orderItem) {
            $keyValueArray[$orderItem->itemId] = $orderItem;
        }

        return response()->json($keyValueArray);
    }

    public static function get($orderId)
    {
        $order = Orders::get($orderId);
        $order->status = OrdersController::getStatus($order->orderNumber, $order->amountTendered);
        //$order->amountTendered = strval($order->amountTendered);
        return response()->json($order);
    }

    public static function save($orderId=false)
    {
        return response()->json(Orders::save($orderId));
    }

    public static function addItem($orderId)
    {
        OrderLineItems::create($orderId);
    }

    public static function updateQty($orderId, $itemId)
    {
        OrderLineItems::updateQty($orderId, $itemId);
        Orders::save($orderId);
    }

}