const indexController = require('../controller/indexController');

exports.indexRouter = function (app) {
  //일정 CRUD API
  app.post('/todo', indexController.createTodo); //create
};
