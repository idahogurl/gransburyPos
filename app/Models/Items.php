<?php
namespace App\Models;
/**
 * Created by PhpStorm.
 * User: rvest
 * Date: 6/21/2015
 * Time: 8:15 PM
 */
class Items
{

    /**
     * @return array of Item objects
     */
    public static function all() {
        return app('db')->table('items')->get();
    }

    public static function import() {
        foreach(app("request")->input() as $input) {
            app("db")->table("items")->insert(["name" => $input["Item Name"], "price" => $input["Price"]]);
        }
    }
}