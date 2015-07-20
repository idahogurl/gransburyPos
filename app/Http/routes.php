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

$app->get("api/orders/{orderNumber}/items/", "OrdersController@getItems");
$app->post("api/orders/{orderNumber}/items/", "OrdersController@addItem");
$app->post("api/orders/{orderNumber}/items/{itemNumber}", "OrdersController@updateQty");
$app->delete("api/orders/{orderNumber}/items/{itemNumber}", "OrdersController@voidItem");
$app->get("api/orders/", "OrdersController@all");
$app->post("api/orders/", "OrdersController@save");
$app->get("api/orders/{orderNumber}", "OrdersController@get");
$app->get("api/items/", "ItemsController@all");
$app->post("api/items/", "ItemsController@import");
$app->post("api/tenderrecords/order/{orderNumber}", "TenderRecordsController@create"); //how to record tender for In Progress item


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
