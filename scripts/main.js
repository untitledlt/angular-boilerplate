(function () {
    'use strict';

    angular.module('app', ['ngRoute', 'ui.bootstrap'])
    
        .run(['$rootScope', function ( $rootScope ) {

            $rootScope.$on('errorResponse', function(event, args) {
                console.warn('errorResponse', event, args);
                alert(args.data || 'Error response!');
            })
        }])


        .controller('MainController', ['$scope', 'MyFactory', function( $scope, MyFactory ) {

            console.info('MainController');

        }])
    
         


        .factory('MyFactory', ['$http', function( $http ) {
            var obj = {};

            obj.getData = function() {
                return {
                    hello: 'world!'
                };
            };

            return obj;
        }])

        .service('HttpInterceptor', ['$rootScope', '$q', function( $rootScope, $q ) {
            var service = this;

            service.request = function( config ) {
                // here goes token injection
                return config;
            };

            service.responseError = function( response ) {
                if ( response.status < 200 || response.status >= 400 ) {
                    $rootScope.$broadcast('errorResponse', response);
                    return $q.reject(response);
                }
                return response;
            };

        }])

        .config(function( $routeProvider, $locationProvider, $httpProvider ) {
        
            $httpProvider.interceptors.push('HttpInterceptor');
            $routeProvider
                .when('/home', {
                    templateUrl: '../partials/mainTemplate.html',
                    controller: 'MainController'
                })
                .when('/about', {
                    template: 'about'
                })
                .otherwise({
                    redirectTo: '/home'
                });
            

        });

}());