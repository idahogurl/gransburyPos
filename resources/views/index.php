<!DOCTYPE html><html xmlns="http://www.w3.org/1999/html" ng-app="orderApp">    <head>        <meta http-equiv="content-type" content="text/html; charset=UTF-8">        <base href="/">        <title>Pizza Store</title>        <link href="assets/css/app.css" rel="stylesheet" type="text/css"/>        <link href="assets/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>        <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,700' rel='stylesheet' type='text/css'/>        <script src="assets/js/jquery-1.11.3.min.js" type="application/javascript"></script>        <script src="assets/js/bootstrap.min.js" type="application/javascript"></script>        <script src="assets/js/angular/angular.min.js" type="application/javascript"></script>        <script src="assets/js/ui-bootstrap-0.13.1.min.js" type="application/javascript"></script>        <script src="assets/app/app.js" type="application/javascript"></script>        <script src="assets/app/order/orderSvc.js" type="application/javascript"></script>        <script src="assets/app/order/orderCtrl.js" type="application/javascript"></script>        <script src="assets/app/order/directives/ordersGrid.js" type="application/javascript"></script>        <script src="assets/app/order/ordersModalCtrl.js"></script>    </head>    <body ng-controller="orderCtrl">        <main role="main">            <div class="text-center"><img src="assets/images/AjaxLoader.gif" ng-hide="!isEmpty(items)"></div>            <div class="container-fluid" ng-hide="isEmpty(items)">                <div class="row-fluid">                    <div class="col-xs-6">                        <div class="row" ng-repeat="itemGroup in items">                            <div class="col-xs-4" ng-repeat="item in itemGroup">                                <button class="btn-danger itemButton"                                        ng-click="addItem(item)">                                    {{item.name}}                                </button>                            </div>                        </div>                    </div>                    <div class="col-xs-6">                        <div class="row">                            <div class="col-xs-12" style="margin-left:300px">                                <button class="btn btn-default" ng-click="viewOrders()">ORDERS</button>                            </div>                        </div>                        <div class="row" style="font-weight: 700">                            <div class="col-xs-12"><span ng-show="isEmpty(order)">New Order</span>                                <span ng-hide="isEmpty(order)">Order: #{{order.orderNumber}}</span>                            </div>                        </div>                        <div class="row" style="border: 1px solid black; min-height: 400px; width: 400px">                            <!--                    <div id="border" style="border: 1px solid black; min-height: 400px; width: 400px">-->                            <div class="col-xs-12 text-center" ng-show="isEmpty(orderLineItems)"                                 style="font-style: italic">No items have been added                            </div>                            <div class="row orderLineItem" ng-repeat="orderLineItem in orderLineItems"                                 ng-click="setSelectedOrderItem(orderLineItem)"                                 ng-class="{selected : selectedOrderItem.itemId === orderLineItem.itemId}" ng-cloak>                                <div class="col-xs-1">{{orderLineItem.qty}}</div>                                <div class="col-xs-5">{{orderLineItem.itemName}}</div>                                <div class="col-xs-6">{{orderLineItem.price}}</div>                            </div>                            <div id="relative">                                <div class="row" style="margin-top: 15px">                                    <div class="col-xs-4 orderInfo">Sub Total:</div>                                    <div class="col-xs-8">{{order.subTotal}}</div>                                </div>                                <div class="row">                                    <div class="col-xs-4 orderInfo">Sales Tax:</div>                                    <div class="col-xs-8">{{order.taxTotal}}</div>                                </div>                                <div class="row">                                    <div class="col-xs-4 orderInfo">Grand Total:</div>                                    <div class="col-xs-8">{{order.grandTotal}}</div>                                </div>                                <div id="tenderRecord" ng-hide="orders.amountTendered == null">                                    <div class="row">                                        <div class="col-xs-4 orderInfo">Amount                                            Tendered:                                        </div>                                        <div class="col-xs-8">{{order.amountTendered}}</div>                                    </div>                                    <div class="row">                                        <div class="col-xs-4 orderInfo">Change Due:                                        </div>                                        <div class="col-xs-8">{{order.changeDue}}</div>                                    </div>                                </div>                            </div>                        </div>                        <div class="row" ng-hide="isEmpty(orderLineItems)" style="margin-top: 15px">                            <div class="col-xs-2">                                <button class="btn btn-default" ng-click="voidItem()"                                        ng-disabled="isEmpty(selectedOrderItem)">VOID                                </button>                            </div>                            <div class="col-xs-10">                                <button class="btn btn-default" data-toggle="modal" data-target="#payModal"                                        ng-disabled="order.paidTimestamp != null">PAY NOW                                </button>                            </div>                        </div>                    </div>                </div>        </main>        <!-- Pay Modal -->        <div id="payModal" class="modal fade" role="dialog">            <div class="modal-dialog">                <!-- Modal content-->                <div class="modal-content">                    <div class="modal-header">                        <button type="button" class="close" data-dismiss="modal">&times;</button>                        <h4 class="modal-title">Tender Payment</h4>                    </div>                    <div class="modal-body">                        <div>                            <div class="container">                                <div class="row">                                    <div class="col-xs-2">Amount Due:</div>                                    <div class="col-xs-10">{{order.grandTotal}}</div>                                </div>                                <div class="row">                                    <div class="col-xs-2">Amount Tendered:</div>                                    <div class="col-xs-10"><input type="number" ng-model="order.amountTendered"                                                                  ng-change="setChangeGiven()"></div>                                </div>                                <div class="row">                                    <div class="col-xs-2">Change Due</div>                                    <div class="col-xs-10">{{order.changeGiven}}</div>                                </div>                            </div>                        </div>                    </div>                    <div class="modal-footer">                        <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="clearTenderRecord()">                            CANCEL                        </button>                        <button type="button" class="btn btn-default" ng-disabled="order.amountTendered <= order.grandTotal"                                ng-click="createTenderRecord(order)">                            TENDER                        </button>                    </div>                </div>            </div>        </div>        <!-- Orders Modal -->        <!-- Import Items Modal -->        <div id="importItemsModal" class="modal fade" role="dialog">            <div class="modal-dialog">                <!-- Modal content-->                <div class="modal-content">                    <div class="modal-header">                        <button type="button" class="close" data-dismiss="modal" onclick="cancelImport()">&times;</button>                        <h4 class="modal-title">Import Items</h4>                    </div>                    <div class="modal-body">                        <span class="btn btn-default btn-file">                            BROWSE... <input type="file" name="importFile" accept="text/csv">                        </span>                        <span id="selectedImportFile"></span>                    </div>                    <div class="modal-footer">                        <button type="button" class="btn btn-default" data-dismiss="modal" onclick="cancelImport()">                            CANCEL                        </button>                        <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="importItems()">RUN</button>                    </div>                </div>            </div>        </div>    </body></html>