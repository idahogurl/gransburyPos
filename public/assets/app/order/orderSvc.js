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
        getOrderLineItems: function (orderId) {
            return this.getData("api/orders/" + orderId + "/items");
        },
        getOrder: function (orderId) {
            return this.getData("api/orders/" + orderId);
        },
        getTenderRecord: function (orderId) {
            return this.getData("api/tenderRecord/" + orderId);
        },
        getOrders: function () {
            return this.getData("api/orders/");
        },
        createOrder: function (order) {           
            return $http.post("api/orders/", order);            
        },
        updateOrder: function(order) {
            return $http.post("api/orders/" + order.orderId,  order);
        },
        updateQty: function (orderId, orderLineItem) {
           return $http.post("api/orders/" + orderId + "/items/" + orderLineItem.itemId, orderLineItem);
        },
        addOrderLineItem: function (orderId, orderLineItem) {
           return $http.post("api/orders/" + orderId + "/items", orderLineItem);
        },
        voidOrderLineItem: function (orderId, itemId) {
            return $http.delete("api/orders/" + orderId + "/items/" + itemId);
        },
        createTenderRecord: function(order) {
            console.log(order);
            return $http.post("api/tenderrecords/orders/" + order.orderId, order); //TODO: how do you know for what in progress order
        },
        importItems: function(items){
           return $http.post("api/items/", items);
        }
    }
});

