'use strict';

/* Directives */


angular.module('olatutalkaServices', [])
.factory('olatutalkaService', ['$rootScope','$http', '$q', '$filter',function($rootScope, $http, $q, $filter) {
    
    var apiUrl = "http://olatuapi.baibalab.net/api/";
    var allActivities,
        filteredActivities,
        allCategories,
        allCities, 
        allTargets,
        allDistricts = [];

        $rootScope.$on('filters:changed', function(e,filters){
            if(filters.days) {
                if(filters.days == 1 ) {
                    filteredActivities = $filter('daterange')(allActivities, '2014-05-23T00:00:00.000Z', '2014-05-23T23:59:00.000Z')
                } else if(filters.days == 2 ) {
                    filteredActivities = $filter('daterange')(allActivities, '2014-05-24T00:00:00.000Z', '2014-05-24T23:59:00.000Z')
                } else if(filters.days == 3 ) {
                    filteredActivities = $filter('daterange')(allActivities, '2014-05-25T00:00:00.000Z', '2014-05-25T23:59:00.000Z')
                } else if(filters.days == 4 ) {
                    filteredActivities = $filter('daterange')(allActivities, '2014-06-01T00:00:00.000Z', '2014-06-01T23:59:00.000Z')
                }
            } else {
                filteredActivities = allActivities;
            }

            if(filters.now) {
                var startDate = moment().toDate();
                var endDate = moment().toDate(); 
                filteredActivities = $filter('current')(filteredActivities, startDate, endDate)
            }

            if(filters.soon) {
                var startDate = moment().toDate();
                var endDate = moment().add('hours', 2).toDate();                 
                filteredActivities = $filter('daterange')(filteredActivities, startDate, endDate)
            }

            if(filters.targets) {
                var startDate = moment().toDate();
                var endDate = moment().toDate();
                filteredActivities = $filter('target')(filteredActivities,filters.targets.id)
            }    

            if(filters.categories) {
                filteredActivities = $filter('category')(filteredActivities,filters.categories.id)
            }

            if(filters.cities) {
                filteredActivities = $filter('city')(filteredActivities,filters.cities.id)
            }
            if(filters.districts) {
                filteredActivities = $filter('district')(filteredActivities,filters.districts.id)
            }            
            $rootScope.$broadcast('activities:filtered');

        })


        function filterByDay(day){

        }


    return {
        activities: function(){
          return filteredActivities;  
        },
        categories: function(){
            return allCategories;
        },
        cities: function(){
            return allCities;
        },
        targets: function(){
            return allTargets;
        }, 
        districts: function(){
            return allDistricts;
        },                   
        init: function(cb){
            // dena hartu hasieran...
            if(!allActivities&&!allCategories&&!allCities){
                $http.jsonp(apiUrl + 'activity?callback=JSON_CALLBACK', { cache: true})
                .then(function(activities){
                    allActivities = activities.data;
                    filteredActivities = activities.data;
                    return $http.jsonp(apiUrl + 'category?callback=JSON_CALLBACK', { cache: true})
                })
                .then(function(categories){
                    allCategories = categories.data;
                    return $http.jsonp(apiUrl + 'city?callback=JSON_CALLBACK', { cache: true})
                }) 
                .then(function(cities){
                    allCities = cities.data;

                    angular.forEach(allCities, function(city, index){
                        angular.forEach(city.districts, function(district, index){
                            allDistricts.push(district)
                        })
                    });

                    return $http.jsonp(apiUrl + 'target?callback=JSON_CALLBACK', { cache: true})
                })
                .then(function(targets){
                    allTargets = targets.data;
                    cb()
                })              
            } else {
                cb()
            }
        },
        getOneActivity: function(id, cb){
            $http.jsonp(apiUrl + 'activity/'+id+'?callback=JSON_CALLBACK', { cache: true}).success(function(data, status){
                cb(data);
            }).error(function(data, status){

            })            
        },
        photos: function(cb){
            $http.jsonp(apiUrl + 'photo?callback=JSON_CALLBACK')
            .then(function(photos){
                cb(photos.data)
            })
        }
    };

}]).factory('filterService', ['$rootScope', function($rootScope) {
    
    var filters = {
        days: '',
        categories: '',
        cities : '',
        districts: '',
        targets: '',
        now:false,
        soon:false
    }

    return {
        setFilter: function(filter, value){
                filters[filter] = value;
                $rootScope.$broadcast('filters:changed', filters);
        },
        setFilters: function(filters){
                filters = filters;
                $rootScope.$broadcast('filters:changed', filters);
        },        
        removeFilter: function(filter, value) {
                filters[filter] = value;
                $rootScope.$broadcast('filters:changed', filters);
        },
        getFilters: function(){
            return filters;
        }
    };

}]).factory('langService', ['$rootScope','$http',function($rootScope, $http) {
    
    var current = 'eu';
    return {
        current: function(){return current},
        setCurrent: function(langCode){
            current = langCode;          
        }
    };
}]);