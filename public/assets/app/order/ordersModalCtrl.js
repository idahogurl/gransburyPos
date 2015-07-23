orderApp.controller('ordersModalCtrl', function ($scope, $modal, orders, orderSvc) {
    $scope.orders = orders;
    orderSvc.orders = orders;
    
    $scope.getOrder = function (orderNumber) {
        $modal.dismiss(orderNumber);
    };
    
    $scope.close = function() {
        $modal.close();
    }    
});

