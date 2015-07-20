<?php
use App\Http\Controllers\Controller;

/**
 * Created by PhpStorm.
 * User: rvest
 * Date: 7/16/2015
 * Time: 12:12 AM
 */
class TenderRecordsController extends Controller
{
    function create($orderNumber) {
        $orderNumber = Orders::setOrderNumber();
        OrderLineItems::setOrderNumber($orderNumber);
        TenderRecords::create($orderNumber);
    }
}