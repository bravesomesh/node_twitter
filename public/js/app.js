// 'use strict';

// var app = angular.module('app', ['appControllers', 'appServices', 'appDirectives', 'appFilters']);
// var appControllers = angular.module('appControllers', []);
// var appServices = angular.module('appServices', []);
// var appDirectives = angular.module('appDirectives', []);
// var appFilters = angular.module('appFilters', []);
(function () {
  'use strict';

  // create the angular app
  angular.module('myApp', [
    'myApp.controllers',
    'myApp.directives'
    ]);

  // setup dependency injection
  angular.module('d3', []);
  angular.module('myApp.controllers', []);
  angular.module('myApp.directives', ['d3']);


}());