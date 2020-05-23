;(function () {
  "use strict"

  angular.module("app").controller("ApiCtrl", ApiCtrl)

  ApiCtrl.$inject = ["$location", "$scope", "$localStorage", "socket", "lodash"]

  function ApiCtrl($location, $scope, $localStorage, socket, lodash) {
    $scope.message = ""
    $scope.speech = "Talk"
    $scope.messages = []
    $scope.users = []
    $scope.likes = []
    $scope.privates = []
    $scope.newItem = "{}"
    $scope.schema = "Profile"
    $scope.profile = $localStorage.account

    if (!socket.isInitialized()) {
      $location.path("/join")
      return
    }

    socket.on("EVENT_USER", function (users) {
      $scope.users = users.filter(function (item) {
        return item.id !== $scope.profile.id
      })
    })

    socket.on("EVENT_RECEIVE_BROADCAST", function (data) {
      $scope.messages.push(data)
      if (data.type === "ai") {
        $scope.synthVoice(data.message)
      }
    })

    socket.on("EVENT_RECEIVE_COLLECTION", function (data) {
      $scope.collection = data
    })

    socket.on("EVENT_RECEIVE_PRIVATE_MESSAGE", function (data) {
      $scope.privates.push(data)
      $scope.privates.push(data)
    })

    socket.on("EVENT_COLLECTION_ADD_ITEM", function (data) {
      $scope.collection = data
    })

    socket.on("EVENT_UPDATE", function (data) {
      $scope.collection = data
    })

    socket.on("EVENT_ERROR", function (e) {
      $scope.error = JSON.stringify(e)
    })

    socket.on("user-liked", function (data) {
      console.log(data)
      $scope.likes.push(data.from)
    })

    $scope.sendMessage = function (to) {
      var newMessage = {
        message: $scope.message,
        from: $scope.profile.email,
        to: to,
      }
      socket.emit("COMMAND_SEND_BROADCAST", newMessage)
      $scope.message = ""
      //$scope.messages.push(newMessage);
    }

    $scope.requestCollection = function (to) {
      var query = {
        schema: $scope.schema,
      }
      socket.emit("COMMAND_REQUEST_COLLECTION", query)
      $scope.collection = {}
    }

    $scope.addItemToCollection = function (newItem) {
      var query = {
        schema: $scope.schema,
        content: JSON.parse($scope.newItem),
      }
      query.content.from = $scope.profile._id
      socket.emit("COMMAND_COLLECTION_ADD_ITEM", query)
      $scope.collection = {}
    }

    $scope.sendLike = function (user) {
      console.log(user)
      var likeObj = {
        from: $scope.profile.id,
        to: user.id,
        socketId: user.socketId,
        data: {},
      }
      socket.emit("COMMAND_SEND_PRIVATE_MESSAGE", likeObj)
    }

    $scope.OnSpeech = function () {
      console.log("Speech clicked")
      recognition.start()
    }

    $scope.synthVoice = function (text) {
      const synth = window.speechSynthesis
      const utterance = new SpeechSynthesisUtterance()
      utterance.lang = "tr-TR"
      utterance.text = text
      synth.speak(utterance)
    }
  }
})()
