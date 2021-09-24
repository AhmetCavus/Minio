;(function () {
  "use strict"

  angular.module("app").controller("JoinCtrl", JoinCtrl)

  JoinCtrl.$inject = ["$location", "$scope", "$localStorage", "socket"]

  function JoinCtrl($location, $scope, $localStorage, socket) {
    $scope.clientId = $localStorage.saveCredentials
      ? $localStorage.clientId
      : ""
    $scope.secretId = $localStorage.saveCredentials
      ? $localStorage.secretId
      : ""
    $scope.channelId = $localStorage.saveCredentials
      ? $localStorage.channelId
      : ""
    $scope.saveCredentials = $localStorage.saveCredentials
    $scope.token = ""
    $scope.info = "Info Panel"
    var account

    $scope.join = function () {
      fetch("/authenticate", {
        method: "POST",
        body: JSON.stringify({
          email: $scope.clientId,
          password: $scope.secretId,
        }),
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then(response => response.json())
        .then(tokenResult => {
          fetch("/channel/" + $scope.channelId, {
            method: "POST",
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + tokenResult.token
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
          .then(response => response.json())
          .then(channelResult => {
            $scope.token = tokenResult.token
            $scope.info = $scope.token
            $scope.info = JSON.stringify(channelResult)
            socket.connect($scope.token, $scope.channelId)
            socket.on("connect", onSocketConnected)
            socket.on("disconnect", onSocketDisconnected)
            socket.on("error", onSocketError)
            socket.on("unauthorized", onSocketUnauthorized)
            account = parseJwt($scope.token)
            $localStorage.account = account
            $localStorage.clientId = $scope.clientId
            $localStorage.secretId = $scope.secretId
            $localStorage.channelId = $scope.channelId
            $localStorage.saveCredentials = $scope.saveCredentials
          })
        })
        .catch(err => {
          $scope.info = err
        })
    }

    function onSocketConnected() {
      $scope.info = "authenticated"
      $location.path("/main")
    }

    function onSocketDisconnected() {
      $scope.info = "disconnected"
    }

    function onSocketError(err) {
      $scope.info = err
    }

    function onSocketUnauthorized(err) {
      $scope.info = err
    }

    function parseJwt(token) {
      var base64Url = token.split(".")[1]
      var base64 = base64Url.replace("-", "+").replace("_", "/")
      return JSON.parse(window.atob(base64))
    }
  }
})()
