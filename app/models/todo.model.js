const Collection = require("./../../src/core/collection")
const Provider = require("./../../src/core/type/provider")

const TodoModel = new Collection("Todo", {
  title: { type: Provider.String, required: true },
  description: Provider.String,
  creationDate: { type: Provider.Date, required: true, default: Date.now },
  endDate: Provider.Date,
  isDone: Provider.Boolean,
  category: {
    type: Provider.ObjectId,
    rel: "Category",
  },
  tasks: [
    {
      title: { type: Provider.String, required: true },
      description: Provider.String,
      creationDate: { type: Provider.Date, required: true, default: Date.now },
      endDate: Provider.Date,
      isDone: Provider.Boolean,
    },
  ],
})

module.exports = TodoModel
