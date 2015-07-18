/**
 * Created by rvest on 7/15/2015.
 */
orderApp.factory("orderSvc", function ($resource) {

    return {
        getAvailableItems: function () {
            return $resource("api/items", null).query().$promise;

        },
        getOrderLineItems: function (orderNumber)  {

            return $resource("api/orderLineItems/:orderNumber", {orderNumber: "@orderNumber"}).get({
                orderNumber: orderNumber,

            }).$promise;
        },
        getOrder: function(orderNumber) {
            return $resource("api/orders/:orderNumber", {orderNumber: "@orderNumber"}).get({
                orderNumber: orderNumber,
            }).$promise;
        },
        getTenderRecord: function(orderNumber) {
            return $resource("api/tenderRecord/:orderNumber", {orderNumber: "@orderNumber"}).get({
                orderNumber: orderNumber,
            }).$promise;
        },
        getOrders: function(orderNumber) {
            return $resource("api/tender/:orderNumber", null).get({
                orderNumber: orderNumber,
            }).$promise;
        },
        getOrdersByFilter: function(filter) {
            return $resource("api/orders/filter", null).post({
                filter: filter,
            }).$promise;
        },
        saveOrder: function(orderNumber) {
            //return $resource("api/tender/:orderNumber", null).get({
            //    orderNumber: orderNumber,
            //}).$promise;
        },
        saveOrderLineItem: function(orderLineItem) {
            //return $resource("api/tender/:orderNumber", null).get({
            //    orderNumber: orderLineItem.orderNumber,
            //}).$promise;
        },
        voidOrderLineItem: function(orderNumber, itemId) {
            return $resource("api/orderLineItems/:orderNumber/:itemId", null).post({
                orderNumber: orderNumber,
                itemId: itemId
            }).$promise;
        }
    }
});

