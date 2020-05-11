const Todo = require("./../models/todo.model")

exports.index = (req, res) => {
  Todo.model.find({}, "-_id -__v -tasks._id", (err, todos) => {
    if (err) {
      res.status(400).json(err)
    } else {
      res.status(200).json(todos)
    }
  })
}
