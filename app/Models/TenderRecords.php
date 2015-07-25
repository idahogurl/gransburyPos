<?php
namespace App\Models;
/**
 * Created by PhpStorm.
 * User: rvest
 * Date: 7/16/2015
 * Time: 12:12 AM
 */
class TenderRecords
{
    public static function create($orderId) {
        $data = [
            "timestamp" => date("Y-m-d H:i:s"),
            "amountTendered" => app("request")->input("amountTendered"),
            "changeGiven" => app("request")->input("changeGiven"),
            "orderId" => $orderId
        ];
        
        app("db")->table("tenderrecords")->insert($data);
    }
}