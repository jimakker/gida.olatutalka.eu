'use strict';

/* Filters */

angular.module('olatutalkaFilters', []).filter('time', function() {
  return function(input) {
  	var d = new Date(input);
  	var hours = d.getHours();
  	var minutes = d.getMinutes();
  	if(hours < 10) hours = '0'+ hours;
  	if(minutes < 10) minutes = '0'+ minutes;
    return hours+':'+minutes;
  };
}).filter('date', function($filter) {
  return function(input) {
    var d = new Date(input);
    var day = d.getDate();
    var output;
    if(day === 23){output=$filter('texts')('day1')}
    else if(day === 24){output=$filter('texts')('day2')}
    else if(day === 25){output=$filter('texts')('day3')} 
    return output;
  };
}).filter('day', function() {
  return function(input) {
    var d = new Date(input);
    var day = d.getDate();

    return day;

  };
}).filter('allTargets', function() {
  var denak = [{texts:{es:{title:"Tod@s"},eu:{title:"Denak"}}}];
  return function(input) {
    if(input.length===6){
      input  = denak;
    }

    return input;
  };
}).filter('daterange', function (){
  return function(activities, start_date, end_date){
    var result = [];
   
    var start_date = (start_date && !isNaN(Date.parse(start_date))) ? Date.parse(start_date) : 0;
    var end_date = (end_date && !isNaN(Date.parse(end_date))) ? Date.parse(end_date) : new Date().getTime();
   
    if (activities && activities.length > 0){
      angular.forEach(activities, function (value, index){
        var activitiesDate = new Date(value.startDate);
   
        if (activitiesDate >= start_date && activitiesDate <= end_date){
          result.push(value);
        }
      });
      return result;
    }
  };
}).filter('current', function (){
  return function(activities, start_date, end_date){
    var result = [];
   
    var start_date = (start_date && !isNaN(Date.parse(start_date))) ? Date.parse(start_date) : 0;
    var end_date = (end_date && !isNaN(Date.parse(end_date))) ? Date.parse(end_date) : new Date().getTime();
   
    if (activities && activities.length > 0){
      angular.forEach(activities, function (value, index){
        var activityStartDate = new Date(value.startDate);
        var activityEndDate = new Date(value.endDate);
   
        if (activityStartDate <= start_date && activityEndDate >= end_date){
          result.push(value);
        }
      });
      return result;
    }
  };
}).filter('category', function (){
  return function(activities, id){
    var result = [];
    if (activities && activities.length > 0){
      angular.forEach(activities, function (activity, index){
        angular.forEach(activity.categories, function (category, index){
          if (category.id === id && result.indexOf(activity)===-1){
            result.push(activity);
          }
        });
      });
      return result;
    }
  };
}).filter('target', function (){
  return function(activities, id){
    var result = [];
    if (activities && activities.length > 0){
      angular.forEach(activities, function (activity, index){
        angular.forEach(activity.targets, function (target, index){
          if (target.id === id && result.indexOf(target)===-1){
            result.push(activity);
          }
        });
      });
      return result;
    }
  };
}).filter('city', function (){
  return function(activities, id){
    var result = [];
    if (activities && activities.length > 0){
      angular.forEach(activities, function (activity, index){
        if (activity.city.id === id && result.indexOf(activity)===-1){
          result.push(activity);
        }
      });
      return result;
    }
  };
}).filter('district', function (){
  return function(activities, id){
    var result = [];
    if (activities && activities.length > 0){
      angular.forEach(activities, function (activity, index){
        if (activity.district && activity.district.id === id && result.indexOf(activity)===-1){
          result.push(activity);
        }
      });
      return result;
    }
  };
}).filter('texts', function(langService) {
  return function(input) {
    return texts[input][langService.current()];
  };
})
.filter('fromNow', function() {
  return function(input) {
    return moment(input).fromNow();
  };
});


var texts = {
  welcome: {
    es: "Bienvenid@ a la guía web <a href='http://olatutalka.eu'>Olatu Talka 2014</a>. Esta <i>web app</i> está siendo desarrollada por el colectivo <a href='http://zukzeuk.org'>ZukZeuk</a> en el marco de las actividades del festival. ",
    eu: "Ongietorria <a href='http://olatutalka.eu'>Olatu Talka 2014</a> web gidara. <i>Web app</i> hau <a href='http://zukzeuk.org'>ZukZeuk</a> elkartea ari da garatzen, jaialdiaren jardueren barne."
  },
  filters: {
    es: "Filtros",
    eu: "Iragazkiak"
  },
  language: {
    es: "Cambiar idioma",
    eu: "Hizkuntza aldatu"
  },
  day: {
    es: 'Día',
    eu: 'Eguna'
  },
  close: {
    es: 'Cerrar',
    eu: 'Itxi'
  },
  start: {
    es: 'Inicio',
    eu: 'Hasiera'
  },
  end: {
    es:'Fin',
    eu:'Bukaera'
  },
  category: {
    es: 'Categoría',
    eu: 'Atala'
  },
  all: {
    es:'Todos',
    eu:'Denak'
  },
  about: {
    es: 'Acerca de',
    eu: 'Honi buruz'
  },
  list: {
    es: 'Lista',
    eu: 'Zerrenda'
  },
  map: {
    es: 'Mapa',
    eu: 'Mapa'
  },
  link: {
    es: 'Enlace',
    eu: 'Esteka'
  },
  organizator: {
    es: 'Organiza',
    eu: 'Antolatzailea'
  },
  allDays: {
    es: 'Todos los días',
    eu: 'Egun guztiak'
  },
  allCategories: {
    es: 'Todas las categorías',
    eu: 'Atal guztiak'
  },
  activities: {
    es: 'actividades',
    eu: 'jarduera'
  },
  city: {
    es: 'Ciudad',
    eu: 'Hiria'
  },
  allCities: {
    es: 'Todas las localidades',
    eu: 'Hiri/herri guztiak'
  },
  allDistricts: {
    es: 'Todos los barrios',
    eu: 'Auzo guztiak'
  },
  district: {
    es:'Barrio',
    eu:'Auzoa'
  },
  target: {
    es: 'Target',
    eu: 'Target'
  },
  allTargets: {
    es: 'Todos los target',
    eu: 'Target guztiak'
  },
  place: {
    es: 'Lugar',
    eu: 'Lekua'
  },
  search: {
    es: 'Buscar',
    eu: 'Bilatu'
  },
  view: {
    es: 'Ver',
    eu: 'Ikusi'
  },
  disclaimer: {
    es: 'Los horarios pueden no estar actualizados al 100%, el horario oficial se puede consultar en la web <a target="_blank" href="http://olatutalka.eu">http://olatutalka.eu</a>',
    eu: 'Ordutegiak baliteke 100%ean eguneratuta ez izatea, ordutegi ofizialak <a target="_blank" href="http://olatutalka.eu">http://olatutalka.eu</a> webgunean topatuko dituzue.'
  },
  day1: {
    es: '23 de Mayo',
    eu: 'Maiatzak 23'
  },
  day2: {
    es: '24 de Mayo',
    eu: 'Maiatzak 24'
  },
  day3: {
    es: '25 de Mayo',
    eu: 'Maiatzak 25'
  },
  now: {
    es: 'Ahora',
    eu: 'Orain'
  },
  soon: {
    es: 'Pronto',
    eu: 'Laister'
  },
  android: {
    es: '¡Descarga la guía <b>Olatu Talka</b> para tu dispositivo <b>Android</b>! Esta aplicación es por <a href="https://twitter.com/pinicius">@pinicius</a> del colectivo  <a href="http://zukzeuk.org">ZukZeuk</a>.<br/><small class="android-abixua">Para poder instalar esta app tendrás que tener activados los <i>orígenes desconocidos</i> en <b>Ajustes > Seguridad</b>.</small>',
    eu: 'Deskargatu zure <b>Android</b> gailurako <b>Olatu Talka</b> gida! Aplikazio hau <a href="http://zukzeuk.org">ZukZeuk</a>-en kide den <a href="https://twitter.com/pinicius">@pinicius</a>-ek garatu du.<br/><small class="android-abixua">App hau instalatzeko <i>orígenes desconocidos</i> aktibatuta izan behar duzu <b>Ajustes > Seguridad</b> menuan.</small>'
  }
}