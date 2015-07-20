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

    public static function all($orderNumber)
    {
        return app('db')->table("orderlineitems")
            ->leftJoin('items', 'items.id', '=', 'orderLineItems.itemId')
            ->where('orderLineItems.orderNumber', '=', $orderNumber)->get();
    }

    public static function create()
    {
        $data = array(
            "qty" => app("request")->input("qty"),
            "extendedPrice" => app("request")->input("extendedPrice"),
            "price" => app("request")->input("price"),
            "itemId" => app("request")->input("itemId")
        );
        app('db')->table("orderlineitems")->insert($data);
    }

    function updateOrderNumber($orderNumber)
    {
        $data = array(
            "orderNumber" => $orderNumber
        );

        //TODO: how do you know what order number to pick the right In Progress one
        app("db")->table("orderlineitems")->where("")->update($data);
    }

    function updateQty($orderNumber, $itemId)
    {
        $data = array(
            "qty" => app("request")->input("qty"),
            "extendedPrice" => app("request")->input("extendedPrice")
        );
        //TODO: how do you know what orderlineitem to update when it doesn't have an orderNumber??
        $where = array("orderNumber" => $orderNumber, "itemId" => $itemId);
        app("db")->table("orderlineitems")->where($where)->update($data);
    }

    function void($orderNumber, $itemId)
    {
        $where = array("orderNumber" => $orderNumber, "itemId" => $itemId);
        app("db")->table("orderlineitems")->where("orderNumber", $where)->delete();
    }
}