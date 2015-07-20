<?php
/**
 * Created by PhpStorm.
 * User: rvest
 * Date: 7/16/2015
 * Time: 12:12 AM
 */
class TenderRecords
{
    function create($orderNumber) {
        $data = [
            "timestamp" => date(),
            "amountTendered" => app("request")->input("amountTendered"),
            "changeGiven" => date("Y-m-d H:i:s"),
            "orderNumber"
        ];
        $tenderRecord["orderNumber"] = $orderNumber;
        app("db")->table("tenderrecords")->insert($tenderRecord);
    }
}