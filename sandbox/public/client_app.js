;(function () {
  "use strict"
})()

angular
  .module("app", [
    "ngCookies",
    "ngRoute",
    "ngSanitize",
    "ngStorage",
    "ngLodash",
  ])
  .config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true)
    $routeProvider
      .when("/main", {
        templateUrl: "main/main.html",
        controller: "MainCtrl",
      })
      .when("/playground", {
        templateUrl: "playground/playground.html",
        controller: "PlaygroundCtrl",
      })
      .when("/logout", {
        templateUrl: "join/join.html",
        controller: "JoinCtrl",
      })
      .when("/join", {
        templateUrl: "join/join.html",
        controller: "JoinCtrl",
      })
      .otherwise({
        redirectTo: "/join",
      })
  })
