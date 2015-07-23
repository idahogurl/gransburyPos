/**
 * Created by rvest on 6/21/2015.
 */

var itemsFileContent;

$(document)
//    .on('show.bs.modal', '.modal', function () {
//        $(this).appendTo($('body'));
//    })
//    .on('shown.bs.modal', '.modal.in', function () {
//        setModalsAndBackdropsOrder();
//    })
//    .on('hidden.bs.modal', '.modal', function () {
//        setModalsAndBackdropsOrder();
//    })
    .on('change', '.btn-file :file', function (event) {
        getItemsFileContents(this, event);
    });

function getItemsFileContents(element, event) {
    var input = $(element),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    $("#selectedFileName").html(label);
    var itemsFile = event.target.files[0];
    if (itemsFile) {
        var r = new FileReader();
        r.onload = function (e) {
            itemsFileContent = toJSON(e.target.result);
        }
        r.readAsText(itemsFile);
    } else {
        //alert("Failed to load file");
    }
    input.trigger('fileselect', [numFiles, label]);
}

function setModalsAndBackdropsOrder() {
    var modalZIndex = 1040;
    $('.modal.in').each(function (index) {
        var $modal = $(this);
        modalZIndex++;
        $modal.css('zIndex', modalZIndex);
        $modal.next('.modal-backdrop.in').addClass('hidden').css('zIndex', modalZIndex - 1);
    });
    $('.modal.in:visible:last').focus().next('.modal-backdrop.in').removeClass('hidden');
}

function toJSON(csv) {

    var lines = csv.split("\r\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {

        var obj = {};
        var currentline = lines[i].split(",");

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);

    }

    return result;
}

function cancelImport() {
    angular.element("#selectedFileName").html("");
}

var orderApp = angular.module("orderApp", ["ui.bootstrap"]);
