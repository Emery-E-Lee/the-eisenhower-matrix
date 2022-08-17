const { pool } = require('../../database');

exports.getUserRows = async function () {
  try {
    const connection = await pool.getConnection(async (conn) => conn); // pool 객체를 사용해서 DB에 접근이 잘 되는지 확인
    try {
      const selectUserQuery = 'SELECT * FROM Users;';
      const [row] = await connection.query(selectUserQuery);
      // connection으로 쿼리(selectUserQuery)를 날리고, 그 결과를 row에 담는다

      return row;
    } catch (err) {
      console.error(`##### getUserRows Query Error #####`);
      return false;
    } finally {
      connection.release(); //connection을 얻었다면, mysql과 연결을 끊어줘야 한다. 안 그러면, 과부하가 걸릴 수 있다. 항상 쿼리가 끝났을 때, release를 해주자.
      // finally는 try나 catch가 끝났을 때 실행된다
    }
  } catch (err) {
    console.error(`##### getUserRows DB Error #####`);
    return false;
  }
};

exports.insertTodo = async function (userIdx, contents, type) {
  try {
    // DB 연결 검사
    const connection = await pool.getConnection(async (conn) => conn);

    // 쿼리
    try {
      const insertTodoQuery =
        'insert into Todos (userIdx, contents, type) values (?, ?, ?);'; //쿼리는 항상 mysql에서 테스트 하고 가져오는 게 좋다.

      const insertTodoParams = [userIdx, contents, type];

      const [row] = await connection.query(insertTodoQuery, insertTodoParams);

      return row;
    } catch (err) {
      console.error(`##### insertTodo Query Error ##### \n ${err}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(`##### insertTodo DB Error ##### \n ${err}`);
    return false;
  }
};

exports.selectTodoByType = async function (userIdx, type) {
  try {
    // DB 연결 검사
    const connection = await pool.getConnection(async (conn) => conn);

    // 쿼리
    try {
      const selectTodoByTypeQuery =
        'select * from Todos where userIdx =? and type = ?'; //쿼리는 항상 mysql에서 테스트 하고 가져오는 게 좋다.

      const selectTodoByTypeParams = [userIdx, type];

      const [row] = await connection.query(
        selectTodoByTypeQuery,
        selectTodoByTypeParams
      );

      return row;
    } catch (err) {
      console.error(`##### selectTodoByType Query Error ##### \n ${err}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(`##### selectTodoByType DB Error ##### \n ${err}`);
    return false;
  }
};
