/**
 * Created by rvest on 7/15/2015.
 */
orderApp.controller("orderCtrl", function ($scope, orderSvc) {
    $scope.order = {};
    $scope.orderLineItems = {};
    $scope.tenderRecord = {};
    $scope.filter = ["inprogress", "unpaid", "paid"];

    orderSvc.getOrdersByFilter($scope.filter).then(
        function (orders) {
            $scope.orders = orders;
        },
        function (statusCode) {

            console.log(statusCode);
        }
    );

    orderSvc.getAvailableItems().then(
        function (items) {
            $scope.items = items;
        },
        function (statusCode) {
            console.log(statusCode);
        }
    );

    $scope.getOrderLineItems = function (orderNumber) {
        orderSvc.getOrderLineItems(orderNumber).then(
            function (orderLineItems) {
                $scope.orderLineItems = orderLineItems;
            },
            function (statusCode) {
                console.log(statusCode);
            }
        );
    };

    $scope.getOrder = function (orderNumber) {
        orderSvc.getOrder(orderNumber).then(
            function (order) {
                $scope.order = order;
            },
            function (statusCode) {

                console.log(statusCode);
            }
        );
    };

    $scope.getTenderRecord = function (orderNumber) {
        orderSvc.getTenderRecord(orderNumber).then(
            function (tenderRecord) {
                $scope.tenderRecord = tenderRecord;
            },
            function (statusCode) {

                console.log(statusCode);
            }
        );
    };

    $scope.addItem = function (item) {
        //find in list
        var orderLineItem = $scope.orderLineItems[item.id];
        //update the item to become an orderLineItem
        if (orderLineItem == undefined) {
            orderLineItem = {};
            orderLineItem.qty = 1;
            orderLineItem.itemName = item.name;
            orderLineItem.price = item.price;
            orderLineItem.itemId = item.id;

        } else {
            orderLineItem.qty++;
        }
        orderLineItem.extendedPrice = this.getExtendedPrice(orderLineItem.qty, orderLineItem.price);

        $scope.orderLineItems[item.id] = orderLineItem;

        this.updateTotals();

        //call to save
        orderSvc.saveOrder($scope.order);
        orderSvc.saveOrderLineItem(orderLineItem);
    };

    $scope.setSelectedOrderItem = function (orderLineItem) {
        $scope.selectedOrderItem = orderLineItem;
    };

    $scope.voidItem = function () {
        $scope.orderLineItems = arrayRemove($scope.orderLineItems, $scope.orderLineItems[$scope.selectedOrderItem.itemId]);
        $scope.selectedOrderItem = {};

        this.updateTotals();
        //call to save
        //orderSvc.saveOrder($scope.order);
        //orderSvc.voidItem($scope.order.orderNumber, itemId);
    };

    $scope.getExtendedPrice = function (qty, price) {
        return (qty * parseFloat(price)).toString();
    };

    $scope.getSubTotal = function () {
        var subTotal = 0;

        $.each($scope.orderLineItems, function (itemId, item) {
            //The orderLineItem object contains more than the orderLineItem objects
            //so skip those keys that are not numeric (the number represents the item id) and those values set to null.

            if ($.isNumeric(itemId)) {
                subTotal += parseFloat(item.extendedPrice);
            }
        });

        return subTotal.toString();
    };

    $scope.getTaxTotal = function () {
        return (this.roundTaxTotal(parseFloat($scope.order.subTotal) * .06)).toString();
    };

    $scope.roundTaxTotal = function (taxTotal) {
        return taxTotal.toFixed(2);
    };

    $scope.getGrandTotal = function () {
        return (parseFloat($scope.order.subTotal) + parseFloat($scope.order.taxTotal)).toString();
    };

    $scope.updateTotals = function () {
        $scope.order.subTotal = this.getSubTotal();
        $scope.order.taxTotal = this.getTaxTotal();
        $scope.order.grandTotal = this.getGrandTotal();
    };

    $scope.setChangeDue = function () {
        var changeDue = $scope.tenderRecord.amountTendered - parseFloat($scope.order.grandTotal);
        if (!$.isNumeric($scope.tenderRecord.amountTendered) || changeDue < 0) {
            $scope.tenderRecord.changeDue = "";
        } else {
            $scope.tenderRecord.changeDue = changeDue;
        }
    };

    $scope.clearTenderRecord = function () {
        $scope.tenderRecord.amountTendered = "";
        $scope.tenderRecord.changeDue = "";
    };


    $scope.getOrdersByFilter = function ($event, filter) {
        updateFilter($event);

        orderSvc.getOrdersByFilter($scope.filter).then(
            function (orders) {
                $scope.orders = orders;
            },
            function (statusCode) {
                console.log(statusCode);
            }
        );
    };

    $scope.isSelected = function (filterName) {
        return $.inArray(filterName, $scope.filter);
    }

    $scope.updateFilter = function ($event) {
        var element = $event.target;

        if (element.checked) {
            if (element.id == "all") {
                $scope.filter = ["inprogress", "unpaid", "paid"];
            } else {
                $scope.filter.push(element.id);
            }

        } else {
            if (element.id == "all") {
                $scope.filter = [];
            } else {
                $scope.filter = arrayRemove($scope.filter, element.id);
            }
        }
    };

    $scope.startNewOrder = function () {
        $scope.order = {};
        $scope.order.orderNumber = '';
        $scope.orderLineItems = {};
    }

    $scope.isFilterSelected = function (name) {
        return $scope.filter.indexOf(id) >= 0;
    };


});

function arrayRemove(arr, itemToRemove) {
    return arr.splice($.inArray(itemtoRemove, arr), 1);
}

function arrayAdd() {

}