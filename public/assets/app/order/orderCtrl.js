/**
 * Created by rvest on 7/15/2015.
 */
orderApp.controller("orderCtrl", function ($scope, $window, $modal, orderSvc) {
    $scope.isLoaded = false;

    $scope.items = {};
    $scope.orderLineItems = {};
    $scope.selectedOrderItem = {};
    $scope.order = {};

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

        modalInstance.result.then(function (orderId) {
            if (orderId == null) { //start new order
                $scope.order = {};
                $scope.orderLineItems = {};
            } else {
                $scope.order = $scope.getOrder(orderId); //view order
            }
        }, function () {
            console.log("Modal dismissed at: " + new Date());
        });
    };

    orderSvc.getAvailableItems().then(
        function (items) {
            $scope.items = items;
            $scope.isLoaded = true;
        },
        function (statusCode) {
            console.log(statusCode);
        }
    );

    $scope.isEmpty = function (obj) {
        return $.isEmptyObject(obj);
    };

    $scope.getOrder = function (orderId) {
        orderSvc.getOrder(orderId).then(
            function (order) {
                $scope.order = order;
                $scope.amountTendered = parseFloat($scope.amountTendered);
                $scope.getOrderLineItems(order.orderId);
            },
            function (statusCode) {
                console.log(statusCode);
            }
        );

    };

    $scope.getOrderLineItems = function (orderId) {

        orderSvc.getOrderLineItems(orderId).then(
            function (orderLineItems) {
                $scope.orderLineItems = orderLineItems;
            },
            function (statusCode) {
                console.log(statusCode);
            }
        );
    };

    $scope.addItem = function (item) {
        //<editor-fold desc="Functions">

        //not an existing orderLineItem, create an orderLineItem
        $scope.createOrderLineItem = function (item) {
            var orderLineItem = {};
            orderLineItem.name = item.name;
            orderLineItem.price = item.price;
            orderLineItem.itemId = item.id;
            orderLineItem.qty = 1;
            return orderLineItem;
        };

        $scope.saveOrderLineItem = function (orderLineItem) {
            if (orderLineItem.qty > 1) {
                //updating existing item
                orderSvc.updateQty($scope.order.orderId, orderLineItem)
            } else {
                orderSvc.addOrderLineItem($scope.order.orderId, orderLineItem);
            }
        }

        $scope.getExtendedPrice = function (qty, price) {
            return (qty * parseFloat(price)).toFixed(2);
        };

        $scope.saveOrder = function () {
            if (undefined == $scope.order.orderId) {
                //new order
                $scope.order.timestamp = moment().format("YYYY-MM-DD hh:mm:ss");
                return orderSvc.createOrder($scope.order);
            } else { //an existing order
                return orderSvc.updateOrder($scope.order);
            }
        };

        $scope.updateQty = function (item) {

            if ($scope.orderLineItems[item.id] === undefined) {
                $scope.orderLineItems[item.id] = this.createOrderLineItem(item);
            } else {
                $scope.orderLineItems[item.id].qty++;
            }

            $scope.orderLineItems[item.id].extendedPrice = this.getExtendedPrice($scope.orderLineItems[item.id].qty, $scope.orderLineItems[item.id].price);
        };
        //</editor-fold>

        this.updateQty(item);

        this.updateOrderTotals();

        this.saveOrder().then(
            function (response) {
                $scope.order.orderId = response.data;

                $scope.saveOrderLineItem($scope.orderLineItems[item.id]);
            },
            function (statusCode) {
                console.log(statusCode);
            });
    };

    $scope.setSelectedOrderItem = function (orderLineItem) {
        $scope.selectedOrderItem = orderLineItem;
    };

    $scope.voidItem = function () {
        delete $scope.orderLineItems[$scope.selectedOrderItem.itemId];

        this.updateOrderTotals();

        orderSvc.updateOrder($scope.order);
        orderSvc.voidOrderLineItem($scope.order.orderId, $scope.selectedOrderItem.itemId);
        $scope.selectedOrderItem = {};
    };

    $scope.updateOrderTotals = function () {
        //<editor-fold desc="Functions">
        $scope.getSubTotal = function (orderItems) {
            var subTotal = 0;

            angular.forEach(orderItems, function (item) {
                subTotal += parseFloat(item.extendedPrice);
            });

            return subTotal.toFixed(2);
        };

        $scope.getTaxTotal = function (subTotal) {
            return (parseFloat(subTotal) * .06).toFixed(2);
        };

        $scope.getGrandTotal = function (subTotal, taxTotal) {
            return (parseFloat(subTotal) + parseFloat(taxTotal)).toFixed(2);
        };
        //</editor-fold>

        $scope.order.subTotal = this.getSubTotal($scope.orderLineItems);
        $scope.order.taxTotal = this.getTaxTotal($scope.order.subTotal);
        $scope.order.grandTotal = this.getGrandTotal($scope.order.subTotal, $scope.order.taxTotal);
    };

    $scope.setChangeGiven = function () {
        var changeDue = $scope.order.amountTendered - parseFloat($scope.order.grandTotal);
        if (!changeDue < 0) {
            $scope.order.changeGiven = 0;
        } else {
            $scope.order.changeGiven = changeDue.toFixed(2);
        }
    };

    $scope.clearTenderRecord = function () {
        $scope.order.amountTendered = 0;
        $scope.order.changeDue = 0;
    };

    $scope.createTenderRecord = function (order) {
        orderSvc.createTenderRecord(order).then(
            function (response) {

                $scope.order.orderNumber = response.data;
                $scope.order.status = "Paid";
            },
            function (statusCode) {
                console.log(statusCode);
            }
        );
    };
});

