/**
 * Created by rvest on 7/15/2015.
 */
orderApp.factory("orderSvc", function ($http, $q, $resource) {

    return {
        getData: function (url) {
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
            return this.getData("api/items");
        },
        getOrderLineItems: function (orderNumber) {
            return this.getData("api/orders/" + orderNumber + "/items");
        },
        getOrder: function (orderNumber) {
            return this.getData("api/orders/" + orderNumber);
        },
        getTenderRecord: function (orderNumber) {
            return this.getData("api/tenderRecord/" + orderNumber);
        },
        getOrders: function () {
            return this.getData("api/orders/");
        },
        saveOrder: function (order) {
             return $http.post("api/orders/", order);
        },
        saveOrderLineItem: function (orderNumber, orderLineItem) {
           return $http.post("api/orders/" + orderNumber + "/items", orderLineItem);
        },
        voidOrderLineItem: function (orderNumber, itemId) {
            return $http.delete("api/orders/" + orderNumber + "/items/" + itemId);
        },
        createTenderRecord: function(order) {
            //return $http.post("api/tenderrecord/order/" + orderNumber, order); //TODO: how do you know for what in progress order
        },
        importItems: function(items){
           return $http.post("api/items/", items);
        }
    }
});

