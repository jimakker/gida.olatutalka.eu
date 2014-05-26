'use strict';

/* Controllers */

var olatutalkaControllers = angular.module('olatutalkaControllers', []);

olatutalkaControllers.controller('MainCtrl', [
    '$scope',
    '$http',
    'olatutalkaService',
    'snapRemote',
    '$filter',
    'langService',
    'filterService',
    '$rootScope',
    '$timeout',
    function($scope, $http, olatutalkaService, snapRemote, $filter, langService, filterService, $rootScope, $timeout) {

        // http://stackoverflow.com/a/6031480
        var ua = navigator.userAgent.toLowerCase();
        var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
        if(isAndroid) {
            $scope.android = true;
        }


        angular.extend($scope, {
            defaults: {
                tileLayer: "http://{s}.tiles.mapbox.com/v3/zukzeuk.i8k04jf0/{z}/{x}/{y}.png",
                maxZoom: 18,
                tileLayerOptions: {
                    attribution: '&copy; <a href="http://mapbox.com">MapBox</a> | &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }
            },
            center: {
                lat: 43.3153499,
                lng: -1.9825611,
                zoom: 12
            }
        });

        
       
        $scope.language = langService.current();
        $scope.filters = filterService.getFilters();
        $scope.activities = olatutalkaService.activities();
        $scope.filtered = $scope.activities;
        $scope.categories = olatutalkaService.categories();
        $scope.cities = olatutalkaService.cities();
        $scope.targets = olatutalkaService.targets();
        $scope.districts = olatutalkaService.districts();


       

        $scope.$on('activities:filtered', function(){
            $scope.activities = olatutalkaService.activities();
            $scope.filtered = $filter('filter')($scope.activities, $scope.search);
            $rootScope.$broadcast('activities:search') 
            scrollToTop()
            initScrollingActivities();

        });

        $scope.filtersChange = function() {
            if($scope.filters.cities&&$scope.filters.cities.districts.length === 0){
                $scope.filters.districts = '';
            }

            filterService.setFilters($scope.filters);

        };

        $scope.searchChanged = function(){
            if($scope.search.length<3){
                if($scope.search.length===0){
                    $scope.filtered = $scope.activities;
                    $rootScope.$broadcast('activities:search')
                    scrollToTop()
                    initScrollingActivities();
                }
            } else {
                $scope.filtered =  $filter('filter')($scope.activities, $scope.search)
                $rootScope.$broadcast('activities:search')
                scrollToTop()
                initScrollingActivities();

            }
        };

        $scope.filtersReset = function() {
            $scope.filters = {
                now: false,
                soon: false
            };
            $scope.search = '';
            filterService.setFilters($scope.filters);
        };        

        $scope.changeLanguage = function(){
            langService.setCurrent($scope.language);
            $rootScope.$broadcast('language:changed')
        };

        initScrollingActivities();

        function initScrollingActivities(){
            $scope.page = 0;
            $scope.ppp = 15;
            $scope.scrollingActivities = $scope.filtered.slice(0,$scope.ppp)
            if($scope.filtered.slice($scope.ppp,$scope.ppp*2).length){
                $scope.loading = true;
            } else {
                $scope.loading = false;
            }
        };




        $scope.infScrollEvent = function(){
            $scope.page++;
            var newItems =  $scope.filtered.slice($scope.page*$scope.ppp,($scope.page+1)*$scope.ppp);
            if(newItems){
                angular.forEach(newItems, function(value,index){
                    $scope.scrollingActivities.push(value);
                })

                if($scope.filtered.slice(($scope.page+1)*$scope.ppp,($scope.page+2)*$scope.ppp).length){
                    $scope.loading = true;
                } else {
                    $scope.loading = false;
                }

            }
        };



        $scope.now = function(){
            $scope.filters.now = !$scope.filters.now;
            $scope.filters.soon = false;
            filterService.setFilters($scope.filters);

        };

        $scope.soon = function(){
            $scope.filters.soon = !$scope.filters.soon;
            $scope.filters.now = false;
            filterService.setFilters($scope.filters);
        };


    }
 ])


.controller('ListCtrl', ['$scope','$rootScope','olatutalkaService','$stateParams','$state','snapRemote',
    function($scope,$rootScope,olatutalkaService,$stateParams,$state,snapRemote){
        snapRemote.close();
        // Zerrenda posizioa eta bistaratutako itemak mantendu?? Oraingoz ez
        // $rootScope.$broadcast('list:view');
        // scrollToTop()

    }   
])

.controller('DetailsCtrl', ['$scope','$rootScope','olatutalkaService','snapRemote','activity',
    function($scope,$rootScope,olatutalkaService,snapRemote,activity){
        scrollToTop()
        snapRemote.close();
        $scope.activity = activity;

        angular.extend($scope, {
            center: {
                lat: activity.loc.coordinates[1],
                lng: activity.loc.coordinates[0],
                zoom: 15
            },
            marker: {
                activityMarker: {
                    lat: activity.loc.coordinates[1],
                    lng: activity.loc.coordinates[0],
                    focus: false,
                    draggable: false
                }
            }
        });



	}
])

.controller('AboutCtrl', ['snapRemote',
    function(snapRemote){
        snapRemote.close();
    }
])

.controller('StreamCtrl', ['snapRemote','photos','$scope',
    function(snapRemote, photos, $scope){
        snapRemote.close();
        $scope.photos = photos.slice(0,15);
    }
])

.controller('MapCtrl', ['$filter','$scope','$rootScope','snapRemote', 'olatutalkaService', 'leafletData', '$state',
    function($filter,$scope, $rootScope, snapRemote, olatutalkaService, leafletData, $state){
        snapRemote.close();
        var markers;

        leafletData.getMap('map').then(function(map) {
            $scope.map = map;
            createMarkers($scope.filtered)
        });        
    
        function createMarkers(activities){

            markers = new L.MarkerClusterGroup();
            
            angular.forEach(activities, function(value,index){

                var ikonoa = catIcons[value.categories[0].id];

                var marker = new L.marker([value.loc.coordinates[1],  value.loc.coordinates[0]],{
                    title: value.texts[$scope.language].title,
                    icon: L.AwesomeMarkers.icon({icon: ikonoa,  prefix: 'fa', iconColor:'white'})
                });
                var descr = $filter('date')(value.startDate)+' <br> ' + $filter('time')(value.startDate) +' - '+ $filter('time')(value.endDate) +'<p>';
                descr += value.categories[0].id==='536e07774892a06a67e2810e' ? '<img width="120" src="talkalive.png"/>' : value.texts[$scope.language].excerpt; 
                descr+='</p>'
                marker.bindPopup('<b>'+value.texts[$scope.language].title+'</b><p>'+descr+'</p><a href="'+$state.href("sarrera.details", { id: value.id })+'" class="btn btn-default btn-olatutalka btn-block active">+info</a>', {maxWidth:200})
                markers.addLayer(marker)

            }); 
            $scope.map.addLayer(markers);
             
        };

        $scope.$on('activities:filtered', function(){
            $scope.map.removeLayer(markers)
            createMarkers($scope.filtered)
        });

        $scope.$on('activities:search', function(){
            $scope.map.removeLayer(markers)
            createMarkers($scope.filtered)
        });

        $scope.$on('language:changed', function(){
            $scope.map.removeLayer(markers)
            createMarkers(olatutalkaService.activities())
        });          

    }
])


function scrollToTop(){
    var scrollArea = document.getElementById('scrollArea');
    scrollArea.scrollTop = 0;    
}

var catIcons = {
    '536e07774892a06a67e2810e': 'music', // talkalive
    '5368b39cb0cc7c69420f03e9': 'camera', // argazkilaritza
    '5367a2d1b0cc7c69420f0388': 'users', // aniztasuna
    '53679f2eb0cc7c69420f0351':'arrow-circle-right', // mugikortasuna
    '5367869eb0cc7c69420f02bd':'comments-o', // hitzaldia
    '53676b73b0cc7c69420f022d':'music', // dantza herrikoiak
    '536130ebc7b92af55f7f4d5d':'photo', // muralismoa
    '536130bdc7b92af55f7f4d5c': 'building-o', // hirigintza
    '5361309fc7b92af55f7f4d5b':'shopping-cart', // azoka
    '5361308ac7b92af55f7f4d5a':'bolt', // kirola
    '53613066c7b92af55f7f4d59':'eye', // moda
    '53613031c7b92af55f7f4d58': 'microphone', // komunikabideak
    '53613005c7b92af55f7f4d57':'globe', // ekologia
    '53612fe8c7b92af55f7f4d56': 'cutlery', // elikadura
    '53612fc9c7b92af55f7f4d55':'cutlery', // gastronomia
    '53612fb4c7b92af55f7f4d54': 'music', // musika eskolak
    '53612f9cc7b92af55f7f4d53':'users', // elkartasuna
    '53612f89c7b92af55f7f4d52':'cog', // instalakuntzak
    '53612f5dc7b92af55f7f4d51': 'music', // dantza
    '53612f51c7b92af55f7f4d50':'music', // musika zuzenean
    '53612ee4c7b92af55f7f4d4e':'smile-o', // antzerkia
    '53612ed8c7b92af55f7f4d4d':'cogs', // tailerra
    '53612ea5c7b92af55f7f4d4c':'video-camera', // zinema
    '53612d74c7b92af55f7f4d47': 'video-camera', // ikus-entzunekoak
    '53612f3bc7b92af55f7f4d4f':'flask', //teknologia berriak
    '5368e91bb0cc7c69420f04b5':'info-circle' // besteak
}