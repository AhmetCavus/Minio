const delayedInvoke = Symbol("delayedInvoke")
const emit = Symbol("emit")
const EMIT_DELAY = 51

class EmitQueue {
  constructor() {
    this._queue = {}
    this._isRunning = false
  }

  enqueue(socket, eventName, data) {
    var emitDelegate = null
    if (!this._queue[socket.name]) {
      var tasks = []
      this._queue[socket.name] = tasks
    }
    var task = () => {
      this[delayedInvoke](socket, eventName, data)
    }
    var tasks = this._queue[socket.name]
    tasks.push(task)
    if (this._isRunning) return
    this._isRunning = true
    var priorTask = tasks[0]
    priorTask()
  }

  [delayedInvoke](socket, eventName, data) {
    setTimeout(() => {
      this[emit](socket, eventName, data)
    }, EMIT_DELAY)
  }

  [emit](socket, eventName, data) {
    socket.emit(eventName, data)
    var tasks = this._queue[socket.name]
    var reducedTasks = tasks.slice(1)
    this._queue[socket.name] = reducedTasks
    if (reducedTasks.length <= 0) {
      this._isRunning = false
    } else {
      var priorTask = reducedTasks[0]
      priorTask()
    }
  }
}

module.exports = new EmitQueue()
