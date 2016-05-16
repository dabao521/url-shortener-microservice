'use strict';

(function(angular){
    var app = angular.module("mainApp", []);
    
    app.component("myHead", {
        transclude : true,
        controller : function(){
            
        },
        templateUrl : "/public/head.html"
    })
    .component("myExample", {
        transclude : true,
        controller : function(){
            
        },
        templateUrl : "/public/example.html"
    });
})(window.angular);