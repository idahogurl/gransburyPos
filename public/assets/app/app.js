/**
 * Created by rvest on 6/21/2015.
 */

$(document)
    .on('change', '.btn-file :file', function (event) {
        getItemsFileContents(this, event);
    });

var orderApp = angular.module("orderApp", ["ngResource", "ui.bootstrap"]);