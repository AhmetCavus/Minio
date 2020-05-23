;(function () {
  "use strict"

  angular.module("app").factory("socket", socket)

  socket.$inject = ["$rootScope"]

  function socket($rootScope) {
    var socket = null

    return {
      on: on,
      emit: emit,
      connect: connect,
      isInitialized: isInitialized,
      logout: logout,
    }

    function isInitialized() {
      return socket ? true : false
    }

    function on(eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments
        $rootScope.$apply(function () {
          callback.apply(socket, args)
        })
      })
    }

    function emit(eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args)
          }
        })
      })
    }

    function connect(token, nsp) {
      socket = io("/" + nsp, {
        query: "token=" + token,
        transports: ["websocket"],
      })
    }

    function logout() {
      socket.destroy()
      socket = null
    }
  }
})()
