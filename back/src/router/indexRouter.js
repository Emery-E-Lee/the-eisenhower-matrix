const indexController = require('../controller/indexController');
const { jwtMiddleware } = require('../../jwtMiddleware');

exports.indexRouter = function (app) {
  //일정 CRUD API
  app.post('/todo', jwtMiddleware, indexController.createTodo); // create
  app.get('/todos', jwtMiddleware, indexController.readTodo); // read
  app.patch('/todo', jwtMiddleware, indexController.updateTodo); // update
  app.delete('/todo/:todoIdx', jwtMiddleware, indexController.deleteTodo); //delete user/1/todo/1: 1번 유저의 1번 할 일을 삭제
  app.get(
    '/dummy',
    function (req, res, next) {
      console.log(1);
      next();
    },
    function (req, res, next) {
      console.log(2);
      next();
    },
    function (req, res) {
      console.log(3);
    }
  );
};
