/**
 * Created by rvest on 7/15/2015.
 */
orderApp.controller("orderCtrl", function ($scope, $window, orderSvc) {
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
    }


    $scope.initFilterButtons();

    $scope.filterOrders = function (orders) {
        $scope.filteredOrders = [];

        $scope.getSelectedFilters = function (filterButtons) {
            var selectedFilters = [];
            for (var filterName in filterButtons) {
                var filterButton = filterButtons[filterName];
                if (filterButton.selected) {
                    selectedFilters.push(filterButton.displayName);
                }
            }

            return selectedFilters;
        }

        $scope.applyFilter = function (orders, selectedFilters) {
            var filteredOrders = [];
            for (var i = 0, len = orders.length; i < len; i++) {
                if ($.inArray(orders[i].status, selectedFilters) != -1) {
                    filteredOrders.push(orders[i]);
                }
            }
            return filteredOrders;
        }

        $scope.filteredOrders = this.applyFilter(orders, this.getSelectedFilters($scope.filterButtons));
    }

    orderSvc.getOrders($scope.filter).then(
        function (orders) {
            $scope.orders = orders;
            $scope.filterOrders(orders);
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
        orderSvc.getOrder(orderNumber).then(
            function (order) {
                $scope.order = order;

                $scope.getOrderLineItems();
            },
            function (statusCode) {

                console.log(statusCode);
            }
        );

    };

    $scope.addItem = function (item) {

        //not an existing orderLineItem, create an orderLineItem
        $scope.setOrderLineItem = function() {
            orderLineItem = {} //what to put for orderNumber??
            orderLineItem.qty = 1;
            orderLineItem.itemName = item.name;
            orderLineItem.price = item.price;
            orderLineItem.itemId = item.id;
        }

        $scope.getExtendedPrice = function(qty, price) {
            return (qty * parseFloat(price)).toString();
        }

        $scope.saveOrder = function() {
            //does it match the filter
            $scope.addToFilteredOrders = function (order, selectedFilters) {
                if ($.inArray(order.status, selectedFilters) != -1) {
                    return true;
                }
                return false
            };

            //TODO, how should this work with multiple In Progress items
            if ($scope.order.orderNumber == undefined) {
                $scope.order.orderNumber = 0;
            }

            if ($scope.status == null) {
                $scope.status = "In Progress";
            }

            $scope.orders.push($scope.order);
            orderSvc.saveOrder($scope.order);

            if (this.addToFilteredOrders($scope.order, this.getSelectedFilters($scope.filterButtons))) {
                $scope.filteredOrders.push($scope.order);
            };
        }



        //find in list
        var orderLineItem = $scope.orderLineItems[item.id];

        if (undefined == orderLineItem) {
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
        }

        $scope.getGrandTotal = function (subTotal, taxTotal) {
            return (parseFloat(subTotal) + parseFloat(taxTotal)).toFixed(2);
        }

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

    $scope.updateFilter = function (filterName) {
        $scope.setAllButtons = function (filterButtons, selected) {
            for (var filterName in filterButtons) {
                filterButtons[filterName].selected = selected;
            }
        };

        $scope.isAllSelected = function (filterButtons) {
            var selectedButtons = [];
            for (var filterName in filterButtons) {

                if (filterButtons[filterName].selected && filterName != "all") {
                    selectedButtons.push(filterName);
                }
            }

            if (selectedButtons.length == 3) {
                return true;
            }
            return false;
        };

        if (filterName == "all") {
            var allButton = $scope.filterButtons["all"];
            allButton.selected = !allButton.selected;

            //set all other buttons to match the All button's selected value
            this.setAllButtons($scope.filterButtons, allButton.selected);

        } else {
            $scope.filterButtons[filterName].selected = !$scope.filterButtons[filterName].selected;

            $scope.filterButtons["all"].selected = this.isAllSelected($scope.filterButtons);
        }

        this.filterOrders($scope.orders);
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

        $('#selectedFileName').html("");
    };
});

