<?php
namespace App\Models;

/**
 * Created by PhpStorm.
 * User: rvest
 * Date: 7/16/2015
 * Time: 12:12 AM
 */
class Orders
{

    public static function get($orderId)
    {
        return app('db')->table("orders")->select(app('db')->raw("orders.*, tenderrecords.timestamp as paidTimeStamp, changeGiven, amountTendered"))
            ->leftJoin('tenderrecords', 'tenderrecords.orderId', '=', 'orders.orderId')
            ->where("orders.orderId", "=", $orderId)->first();
    }

    public static function all()
    {
        return app('db')->table("orders")->select(app('db')->raw("orders.*, amountTendered"))
            ->leftJoin('tenderrecords', 'tenderrecords.orderId', '=', 'orders.orderId')
            ->get();
    }

    public static function save($orderId=false)
    {
        $data = [
            "subTotal" => floatval(app("request")->input("subTotal")),
            "taxTotal" => floatval(app("request")->input("taxTotal")),
            "grandTotal" =>floatval(app("request")->input("grandTotal")),
            "timestamp" => app("request")->input("timestamp")
        ];

        if ($orderId === false) {
            return app("db")->table("orders")->insertGetId($data);
        } else {
            unset($data["timestamp"]);

            app("db")->table("orders")->where("orderId", "=", $orderId)
                ->update($data);
        }
    }

    public static function setOrderNumber($orderId)
    {
        return app("db")->transaction(function ($orderId) use ($orderId) {
            $orderNumber = app("db")->table("orders")->max("orderNumber");

            if ($orderNumber == 100) {
                $orderNumber = 1;
            }
            $orderNumber++;

            app("db")->table("orders")->where("orderId", "=", $orderId)->update(["orderNumber" => $orderNumber]);

            return $orderNumber;
        });
    }
}