<?php
namespace App\Models;


/**
 * Created by PhpStorm.
 * User: rvest
 * Date: 7/16/2015
 * Time: 12:12 AM
 */
class OrderLineItems
{

    public static function all($orderId)
    {
        return app('db')->table("orderlineitems")
            ->join('items', 'items.id', '=', 'orderLineItems.itemId')
            ->where('orderLineItems.orderId', '=', $orderId)->get();
    }

    public static function create($orderId)
    {
        $data = array(
            "qty" => app("request")->input("qty"),
            "extendedPrice" => floatval(app("request")->input("extendedPrice")),
            "price" => floatval(app("request")->input("price")),
            "itemId" => app("request")->input("itemId"),
            "orderId" => $orderId
        );
        app('db')->table("orderlineitems")->insert($data);
    }

    public static function updateQty($orderId, $itemId)
    {
        $data = array(
            "qty" => app("request")->input("qty"),
            "extendedPrice" => app("request")->input("extendedPrice")
        );
        
        $where = array("orderId" => $orderId, "itemId" => $itemId);
        app("db")->table("orderlineitems")->where($where)->update($data);
    }

    public static function void($orderId, $itemId)
    {
        $where = array("orderId" => $orderId, "itemId" => $itemId);
        app("db")->table("orderlineitems")->where("orderId", $where)->delete();
    }
}