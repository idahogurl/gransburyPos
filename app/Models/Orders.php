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

   public static function all()
    {
        return app('db')->table("orders")->select(app('db')->raw("orders.*, amountTendered"))
            ->leftJoin('tenderrecords', 'tenderrecords.orderNumber', '=', 'orders.orderNumber')
            ->get();
    }

    public static function save()
    {
        $data = [
            "subTotal" => app("request")->input("subTotal"),
            "taxTotal" => app("request")->input("taxTotal"),
            "grandTotal" => app("request")->input("grandTotal"),
            "timestamp" => date("Y-m-d H:i:s")
        ];

        $orderNumber = app("request")->input("orderNumber");

        if ($orderNumber == 0) {

            app("db")->table("orders")->insert($data);
        } else {
            unset($data["timestamp"]);

            app("db")->table("orders")->where("orderNumber", $orderNumber)
                ->update($data);
        }
    }

    public static function setOrderNumber()
    {
        app("db")->transaction(function ($order) {
            $orderNumber = app("db")->table("orders")->max("orderNumber")->get();

            if ($orderNumber == 100) {
                $orderNumber = 1;
            }
            $order["orderNumber"] = $orderNumber;

            //TODO: how do you know what in progress order to update??
            app("db")->table("orders")->where("")->update($order);
        });
    }
}