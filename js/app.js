'use strict';


var olatutalkaApp = angular.module('olatutalkaApp',[
  'ui.router',
  'olatutalkaControllers',
  'olatutalkaFilters',
  'olatutalkaDirectives',
  'olatutalkaServices',
  'snap',
  'ngSanitize',
  'leaflet-directive'
]);

olatutalkaApp.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
      .state('sarrera', {
        abstract: true,
        url: '/',
        templateUrl: 'partials/home.html',
        controller: 'MainCtrl',
        resolve: {
          activities: ['$q','olatutalkaService', function($q, olatutalkaService){
            var deferred = $q.defer();
            olatutalkaService.init(function(){
              deferred.resolve();
            });
            return deferred.promise;
          }],
        }        
      })
      .state('sarrera.list', {
        url: '',
        templateUrl: 'partials/list.html',
        controller: 'ListCtrl'        
      }) 
      .state('sarrera.map', {
        url: 'map',
        templateUrl: 'partials/map.html',
        controller: 'MapCtrl'        
      })       
      .state('sarrera.details', {
        url: 'a/:id',
        templateUrl: 'partials/details.html',
        controller: 'DetailsCtrl',
        resolve: {
          activity: ['$q','olatutalkaService','$stateParams', function($q, olatutalkaService, $stateParams){
            var deferred = $q.defer();
            olatutalkaService.getOneActivity($stateParams.id, function(data){
              deferred.resolve(data);
            });
            return deferred.promise;
          }],
        }        
      })
      .state('sarrera.about', {
        url: 'about',
        templateUrl: 'partials/about.html',
        controller: 'AboutCtrl'
      })
      .state('sarrera.android', {
        url: 'android',
        templateUrl: 'partials/android.html',
        controller: 'AboutCtrl'
      })
      .state('sarrera.stream', {
        url: 'stream',
        templateUrl: 'partials/stream.html',
        controller: 'StreamCtrl',
        resolve: {
          photos: ['$q','olatutalkaService', function($q, olatutalkaService){
            var deferred = $q.defer();
            olatutalkaService.photos(function(data){
              deferred.resolve(data);
            });
            return deferred.promise;
          }],
        }        
      })      
  }]);
