/**
 * Created by rvest on 7/15/2015.
 */
orderApp.controller("orderCtrl", function ($scope, $window, $modal, orderSvc) {
    $scope.items = {};
    $scope.order = {};
    $scope.orderLineItems = {};
    $scope.selectedOrderItem = {};

    $scope.viewOrders = function () {
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: "assets/app/order/templates/ordersModal.html",
            controller: "ordersModalCtrl",
            size: "lg",
            backdrop: false,
            windowTemplateUrl: "assets/app/order/templates/modal/window.html",
            resolve: {
                orders: function () {
                    return orderSvc.getOrders();
                }
            }
        });

        modalInstance.result.then(function (orderNumber) {
            $scope.order = $scope.getOrder(orderNumber);
        }, function () {
            console.log("Modal dismissed at: " + new Date());
        });
    };

    orderSvc.getAvailableItems().then(
            function (items) {
                $scope.items = items;
            },
            function (statusCode) {
                console.log(statusCode);
            }
    );

    $scope.isEmpty = function (obj) {
        return $.isEmptyObject(obj);
    };

    $scope.getOrderLineItems = function () {

        orderSvc.getOrderLineItems($scope.order.orderNumber).then(
                function (orderLineItems) {
                    $scope.orderLineItems = orderLineItems;
                },
                function (statusCode) {
                    console.log(statusCode);
                }
        );
    };

    $scope.getOrder = function (orderNumber) {

        $scope.order = orderSvc.orders[orderNumber];

        $scope.getOrderLineItems();
    };

    $scope.getOrders = function () {
        orderSvc.getOrders();
    };

    $scope.addItem = function (item) {

        //not an existing orderLineItem, create an orderLineItem
        $scope.setOrderLineItem = function () {
            var orderLineItem = {}; //what to put for orderNumber??
            orderLineItem.qty = 1;
            orderLineItem.itemName = item.name;
            orderLineItem.price = item.price;
            orderLineItem.itemId = item.id;
        };

        $scope.getExtendedPrice = function (qty, price) {
            return (qty * parseFloat(price)).toString();
        };

        $scope.saveOrder = function () {


            //TODO, how should this work with multiple In Progress items
            if ($scope.order.orderNumber === undefined) {
                $scope.order.orderNumber = 0;
            }

            if ($scope.status === null) {
                $scope.status = "In Progress";
            }

            orderSvc.orders.push($scope.order);
            orderSvc.saveOrder($scope.order);
        };

        //find in list
        var orderLineItem = $scope.orderLineItems[item.id];

        if (undefined === orderLineItem) {
            this.setOrderLineItem();
        } else {
            orderLineItem.qty++;
        }

        orderLineItem.extendedPrice = this.getExtendedPrice(orderLineItem.qty, orderLineItem.price);

        $scope.orderLineItems[item.id] = orderLineItem;

        this.updateTotals();
        this.saveOrder();

        orderSvc.saveOrderLineItem($scope.order.orderNumber, orderLineItem);

    };

    $scope.setSelectedOrderItem = function (orderLineItem) {
        $scope.selectedOrderItem = orderLineItem;
    };

    $scope.voidItem = function () {
        delete $scope.orderLineItems[$scope.selectedOrderItem.itemId];

        this.updateTotals();

        orderSvc.saveOrder($scope.order);
        orderSvc.voidOrderLineItem($scope.order.orderNumber, $scope.selectedOrderItem.itemId);

        $scope.selectedOrderItem = {};
    };

    $scope.updateTotals = function () {
        $scope.getSubTotal = function (orderItems) {
            var subTotal = 0;

            $.each(orderItems, function (itemId, item) {
                //The orderLineItem object contains more than the orderLineItem objects
                //so skip those keys that are not numeric (the number represents the item id) and those values set to null.

                if ($.isNumeric(itemId)) {
                    subTotal += parseFloat(item.extendedPrice);
                }
            });

            return subTotal.toFixed(2);
        };

        $scope.getTaxTotal = function (subTotal) {
            return (parseFloat(subTotal) * .06).toFixed(2);
        };

        $scope.getGrandTotal = function (subTotal, taxTotal) {
            return (parseFloat(subTotal) + parseFloat(taxTotal)).toFixed(2);
        };

        $scope.order.subTotal = this.getSubTotal($scope.orderLineItems);
        $scope.order.taxTotal = this.getTaxTotal($scope.order.subTotal);
        $scope.order.grandTotal = this.getGrandTotal($scope.order.subTotal, $scope.order.taxTotal);
    };

    $scope.setChangeGiven = function () {
        var changeDue = $scope.order.amountTendered - parseFloat($scope.order.grandTotal);
        if (!$.isNumeric($scope.order.amountTendered) || changeDue < 0) {
            $scope.order.changeGiven = "";
        } else {
            $scope.order.changeGiven = changeDue.toFixed(2);
        }
    };

    $scope.clearTenderRecord = function () {
        $scope.order.amountTendered = "";
        $scope.order.changeDue = "";
    };

    $scope.startNewOrder = function () {
        $scope.order = {};
        $scope.order.orderNumber = 0; //TODO
        $scope.orderLineItems = {};
    };

    $scope.createTenderRecord = function () {
        orderSvc.createTenderRecord($scope.order).then(
                function (orderNumber) {
                    $scope.order.orderNumber = orderNumber;
                },
                function (statusCode) {
                    console.log(statusCode);
                }
        );
    };

    $scope.importItems = function () {
        orderSvc.importItems($window.itemsFileContent);

        angular.element("#selectedFileName").html("");
    };
});

