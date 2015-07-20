<?php
namespace App\Http\Controllers;

/**
 * Created by PhpStorm.
 * User: rvest
 * Date: 6/21/2015
 * Time: 7:41 PM
 */
class ItemsController extends Controller
{
    /**
     * Products constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->load->model('items_model');
        $this->response->format = "json";
    }

    //Must expose a list method that returns a list of all available items.
    public function index_get() {
        $items = $this->items_model->all();
        $itemsGrouped = array();

       $itemsGroupedIndex = -1;
       for ($itemIndex = 0; $itemIndex < count($items); $itemIndex++) {
           if ($itemIndex % 3 == 0) {
               $itemsGroupedIndex++;
               $itemsGrouped[] = array();
           }

           $itemsGrouped[$itemsGroupedIndex][] = $items[$itemIndex];
       }
       //} else {
           $this->response($itemsGrouped);
       //}
    }
    //Must expose an API call that permits a csv file with a list of items and prices to be imported. The list of items is attached.
    public function index_post() {
    }
}