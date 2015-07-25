<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

$app->get('/', function () {
    return view('index');
});

$app->get("api/orders/{orderId}/items/", "OrdersController@getItems");
$app->post("api/orders/{orderId}/items/", "OrdersController@addItem");
$app->post("api/orders/{orderId}/items/{itemNumber}", "OrdersController@updateQty");
$app->delete("api/orders/{orderId}/items/{itemNumber}", "OrdersController@voidItem");
$app->get("api/orders/", "OrdersController@all");
$app->post("api/orders/", "OrdersController@save");
$app->post("api/orders/{orderId}", "OrdersController@save");
$app->get("api/orders/{orderId}", "OrdersController@get");
$app->get("api/items/", "ItemsController@all");
$app->post("api/items/", "ItemsController@import");
$app->post("api/tenderrecords/orders/{orderId}", "TenderRecordsController@create"); //how to record tender for In Progress item


//$app->get('orders/{orderNumber}/items/', function () {
//    echo "hello";
//});
//
//$app->put('foo/bar', function () {
//    //
//});
//
//$app->delete('foo/bar', function () {
//    //
//});
//
//$app->get('user/{id}', 'UserController@showProfile');
