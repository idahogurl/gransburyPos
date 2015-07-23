/**
 * Created by rvest on 7/15/2015.
 */
orderApp.factory("orderSvc", function ($http, $q) {
    var orders = undefined;

    return {
        orders: this.orders,
        get: function (url) {
            var deferred = $q.defer();
            $http.get(url).
                    success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject(status);
                    });
            return deferred.promise;
        },
        getAvailableItems: function () {
            return this.get("api/items");
        },
        getOrderLineItems: function (orderNumber) {
            return this.get("api/orders/" + orderNumber + "/items");
        },
        getTenderRecord: function (orderNumber) {
            return this.get("api/tenderRecord/" + orderNumber);
        },
        getOrders: function () {
            return this.get("api/orders/");
        },
        saveOrder: function (order) {
            //does it match the filter
            addToFilteredOrders = function (order, selectedFilters) {
                return $.inArray(order.status, selectedFilters) !== -1;
            };

            if (this.addToFilteredOrders(order, this.getSelectedFilters($scope.filterButtons))) {
                orders.push($scope.order);
            }
            return $http.post("api/orders/", order);
        },
        saveOrderLineItem: function (orderNumber, orderLineItem) {
            return $http.post("api/orders/" + orderNumber + "/items", orderLineItem);
        },
        voidOrderLineItem: function (orderNumber, itemId) {
            return $http.delete("api/orders/" + orderNumber + "/items/" + itemId);
        },
        createTenderRecord: function (order) {
            //return $http.post("api/tenderrecord/order/" + orderNumber, order); //TODO: how do you know for what in progress order
        },
        importItems: function (items) {
            return $http.post("api/items/", items);
        }
    }
});

