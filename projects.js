angular.module('tree', ['firebase','leaflet-directive']).
value('fbURL', 'https://grafa-gisdata.firebaseio.com/features/').
factory('Trees', function(angularFireCollection, fbURL) {
  return angularFireCollection(fbURL);
}).
config(function($routeProvider) {
  $routeProvider.
    when('/', {controller:ListCtrl, templateUrl:'list.html'}).
    when('/edit/:treeId', {controller:EditCtrl, templateUrl:'detail.html'}).
    when('/map/:treeId', {controller:MapCtrl, templateUrl:'map.html'}).
    when('/new', {controller:CreateCtrl, templateUrl:'detail.html'}).
    otherwise({redirectTo:'/'});
});
 
function ListCtrl($scope, Trees) {
  $scope.trees = Trees;
}

function CreateCtrl($scope, $location, $timeout, Trees) {
  $scope.save = function() {
    Trees.add($scope.tree, function() {
      $timeout(function() { $location.path('/'); });
    });
  }
}
 
function EditCtrl($scope, $location, $routeParams, angularFire, fbURL) {
  angularFire(fbURL + $routeParams.treeId, $scope, 'remote', {}).
  then(function() {
    $scope.tree = angular.copy($scope.remote);
    $scope.tree.$id = $routeParams.treeId;
    $scope.isClean = function() {
      return angular.equals($scope.remote, $scope.tree);
    }
    $scope.destroy = function() {
      $scope.remote = null;
      $location.path('/');
    };
    $scope.save = function() {
      $scope.remote = angular.copy($scope.tree);
      $location.path('/');
    };
  });
}

function MapCtrl($scopels) {

  angular.extend($scope, {
    portland: {
      lat: 45.41,
      lng: -122.609,
      zoom: 9
    },
    markers: {
      m1: {
        lat: 45.505,
        lng: -122.609,
        message: "Home"
      },
      m2: {
        lat: 45,
        lng: -122.667,
        focus: true,
        message: "What a drag.",
        draggable: true
      }
    },
      defaults: {
      tileLayer: "http://api.tiles.mapbox.com/v3/grafa.map-1h9zp83q/{z}/{x}/{y}.png",
      tileLayerOptions: {
        opacity: 0.9,
        detectRetina: true,
        reuseTiles: true,
      }
    }
  });
}