orderApp.directive("ordersGrid", function () {
    return    {
        restrict: "E",
        templateUrl: "assets/app/order/templates/ordersGrid.html",
        scope: {
            orders: "="
                    //clickOrder: "&"
        },
        controller: function ($scope) {

            //Creates the filter buttons to show
            $scope.initFilterButtons = function () {
                $scope.filterButtons = {
                    'all': {name: "all", displayName: "ALL", selected: true},
                    'inprogress': {name: "inprogress", displayName: "IN PROGRESS", selected: true},
                    'unpaid': {name: "unpaid", displayName: "UNPAID", selected: true},
                    'paid': {name: "paid", displayName: "PAID", selected: true}
                };
            }

            $scope.initFilterButtons();

            $scope.filterOrders = function (orders) {
                $scope.filteredOrders = [];

                //Returns which filters are selected
                $scope.getSelectedFilters = function (filterButtons) {
                    var selectedFilters = [];
                    angular.forEach(filterButtons, function (filterButton) {

                        if (filterButton.selected) {
                            selectedFilters.push(filterButton.displayName);
                        }
                    });

                    return selectedFilters;
                };

                //Returns orders matching the selected filters
                $scope.applyFilter = function (orders, selectedFilters) {
                    var filteredOrders = [];
                    angular.forEach(orders, function (order) {
                        if ($.inArray(order.status.toUpperCase(), selectedFilters) !== -1) {
                            filteredOrders.push(order);
                        }
                    });
                    return filteredOrders;
                }

                return this.applyFilter(orders, this.getSelectedFilters($scope.filterButtons));
            };

            $scope.updateFilter = function (filterButtonName) {

                //Sets all the buttons to the value of selected
                $scope.setAllButtons = function (filterButtons, selected) {
                    angular.forEach(filterButtons, function (filterButton) {
                        filterButton.selected = selected;
                    });
                };

                //Sets the ALL button to selected when all of the other buttons are selected
                $scope.isAllSelected = function (filterButtons) {
                    var selectedButtons = [];
                    for (var filterName in filterButtons) {
                        if (filterButtons[filterName].selected && filterName !== "all")
                            selectedButtons.push(filterName);
                    }

                    return selectedButtons.length === 3;

                };

                if (filterButtonName === "all") {
                    //toggle the selected state for the ALL button
                    $scope.filterButtons["all"].selected = !$scope.filterButtons["all"].selected;

                    //set all other buttons to match the selected property of the ALL button
                    this.setAllButtons($scope.filterButtons, $scope.filterButtons["all"].selected);

                } else {
                    //toggle the selected state of the clicked button
                    $scope.filterButtons[filterButtonName].selected = !$scope.filterButtons[filterButtonName].selected;

                    //Set ALL button to selected when all the other filter buttons 
                    $scope.filterButtons["all"].selected = this.isAllSelected($scope.filterButtons);
                }

                $scope.filteredOrders = $scope.filterOrders($scope.orders);

            };
            $scope.filteredOrders = $scope.filterOrders($scope.orders);
        }
    }
});