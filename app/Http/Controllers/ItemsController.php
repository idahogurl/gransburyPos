<?php
namespace App\Http\Controllers;
use App\Models\Items;

/**
 * Created by PhpStorm.
 * User: rvest
 * Date: 6/21/2015
 * Time: 7:41 PM
 */
class ItemsController extends Controller
{
    //Must expose a list method that returns a list of all available items.
    public function all() {
        $items = Items::all();
        $itemsGrouped = array();

       $itemsGroupedIndex = -1;
       for ($itemIndex = 0; $itemIndex < count($items); $itemIndex++) {
           if ($itemIndex % 3 == 0) {
               $itemsGroupedIndex++;
               $itemsGrouped[] = array();
           }

           $itemsGrouped[$itemsGroupedIndex][] = $items[$itemIndex];
       }
        return response()->json($itemsGrouped);
    }

    public function import() {
       Items::import();
    }

//    //Must expose an API call that permits a csv file with a list of items and prices to be imported. The list of items is attached.
//    public function index_post() {
//    }
}