/**
 * Created by rvest on 7/15/2015.
 */
orderApp.controller("orderCtrl", function ($scope, $window, orderSvc) {
    $scope.isLoaded = false;
    $scope.items = {};
    $scope.orders = {};
    $scope.order = {};
    $scope.orderLineItems = {};
    $scope.selectedOrderItem = {};
    $scope.filterButtons = [];

    $scope.initFilterButtons = function () {

        $scope.filterButtons = {
            'all': {name: "all", displayName: "All", selected: true},
            'inprogress': {name: "inprogress", displayName: "In Progress", selected: true},
            'unpaid': {name: "unpaid", displayName: "Unpaid", selected: true},
            'paid': {name: "paid", displayName: "Paid", selected: true}
        };
    };

    $scope.initFilterButtons();

    $scope.filterOrders = function (orders) {
        $scope.filteredOrders = {};

        $scope.getSelectedFilters = function (filterButtons) {
            var selectedFilters = [];
            angular.forEach(filterButtons, function (filterButton) {

                if (filterButton.selected) {
                    selectedFilters.push(filterButton.displayName);
                }
            });

            return selectedFilters;
        };

        $scope.applyFilter = function (orders, selectedFilters) {
            var filteredOrders = {};
            angular.forEach(orders, function(order) {
                if ($.inArray(order.status, selectedFilters) != -1) {
                    filteredOrders[order.orderId] = order;
                }
            });
            return filteredOrders;
        };

        $scope.filteredOrders = this.applyFilter(orders, this.getSelectedFilters($scope.filterButtons));
    };

    orderSvc.getAvailableItems().then(
            function (items) {
                $scope.items = items;

                orderSvc.getOrders().then(
                        function (orders) {
                            $scope.orders = orders;
                            $scope.filterOrders(orders);

                            $scope.isLoaded = true;
                        },
                        function (statusCode) {
                            console.log(statusCode);
                        });
            },
            function (statusCode) {
                console.log(statusCode);
            }
    );

    $scope.isEmpty = function (obj) {
        return $.isEmptyObject(obj);
    };

    $scope.getOrderLineItems = function () {

        orderSvc.getOrderLineItems($scope.order.orderId).then(
                function (orderLineItems) {
                    $scope.orderLineItems = orderLineItems;
                },
                function (statusCode) {
                    console.log(statusCode);
                }
        );
    };

    $scope.getOrder = function (orderId) {
        orderSvc.getOrder(orderId).then(
                function (order) {

                    if (order.amountTendered) {
                        order.amountTendered = parseFloat(order.amountTendered); //input types of number want a number not string
                    }

                    $scope.order = order;

                    //clear out the previous item selected so VOID does not show
                    $scope.selectedOrderItem = {};

                    $scope.getOrderLineItems();
                },
                function (statusCode) {

                    console.log(statusCode);
                }
        );

    };


    $scope.addItem = function (item) {

        //not an existing orderLineItem, create an orderLineItem
        $scope.createOrderLineItem = function (item) {
            var orderLineItem = {};
            orderLineItem.name = item.name;
            orderLineItem.price = item.price;
            orderLineItem.itemId = item.id;

            $scope.orderLineItems[item.id] = orderLineItem;
        };
        
        $scope.saveOrderLineItem = function(orderLineItem) {            
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
        
        //does it match the filter
        $scope.addToFilteredOrders = function (order, selectedFilters) {
           return $.inArray(order.status, selectedFilters) !== -1;
        };

        $scope.saveOrder = function () {            
            if (undefined === $scope.order.orderId) {         
                return orderSvc.createOrder($scope.order)
            } else {
                return orderSvc.updateOrder($scope.order);
            }
        };

        $scope.updateQty = function(item) {
            var orderLineItem = $scope.orderLineItems[item.id];
            if (orderLineItem === undefined) {
                this.createOrderLineItem(item);
                orderLineItem = $scope.orderLineItems[item.id];
                orderLineItem.qty = 1;
            } else {
                orderLineItem.qty++;
            }
            
            orderLineItem.extendedPrice = this.getExtendedPrice(orderLineItem.qty, orderLineItem.price);
        };

        this.updateQty(item);
        this.updateOrderTotals();

        $scope.order.timestamp = moment().format("YYYY-MM-DD hh:mm:ss");

        this.saveOrder().then(
            function (response) {
                if ($scope.order.orderId === undefined) {
                    $scope.order.orderId = response.data;
                    $scope.order.status = "In Progress";

                    alert($scope.order.timestamp);
                    $scope.orders[$scope.order.orderId] = $scope.order;

                    if ($scope.addToFilteredOrders($scope.order, $scope.getSelectedFilters($scope.filterButtons))) {
                        $scope.filteredOrders[$scope.order.orderId] = $scope.order;
                    }                    
                }
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

        if (!$scope.isEmpty($scope.filteredOrders[$scope.order.orderId])) {
            $scope.filteredOrders[$scope.order.orderId] = $scope.order;
        }

    };

    $scope.setChangeGiven = function () {
        var changeDue = $scope.order.amountTendered - parseFloat($scope.order.grandTotal).toFixed(2);
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

    $scope.updateFilter = function (filterName) {
        $scope.setAllButtons = function (filterButtons, selected) {
            $.each(filterButtons, function (filterName, filterButton) {
                filterButton.selected = selected
            });
        };

        $scope.isAllSelected = function (filterButtons) {
            var selectedButtons = [];
            for (var filterName in filterButtons) {

                if (filterButtons[filterName].selected && filterName != "all")
                    selectedButtons.push(filterName);
            }

            return selectedButtons.length == 3;

        };

        if (filterName === "all") {
            var allButton = $scope.filterButtons["all"];
            allButton.selected = !allButton.selected;

            //set all other buttons to match the All button's selected value
            this.setAllButtons($scope.filterButtons, allButton.selected);

        } else {
            $scope.filterButtons[filterName].selected = !$scope.filterButtons[filterName].selected;

            $scope.filterButtons["all"].selected = this.isAllSelected($scope.filterButtons);
        }

        this.filterOrders();
    };

    $scope.startNewOrder = function () {
        $scope.order = {};
        $scope.orderLineItems = {};
    };

    $scope.createTenderRecord = function (order) {
        orderSvc.createTenderRecord(order).then(
                function (response) {
                    $scope.order.orderNumber = response.data;
                    $scope.order.status = "Paid";
                    $scope.orders[$scope.order.orderId] = $scope.order;
                    $scope.filteredOrders[$scope.order.orderId] = $scope.order;
                },
                function (statusCode) {
                    console.log(statusCode);
                }
        );
    };

    $scope.importItems = function () {
        orderSvc.importItems($window.itemsFileContent);

        $('#selectedFileName').html("");
    };
});

