const indexDao = require('../dao/indexDao');

exports.createTodo = async function (req, res) {
  const { userIdx, contents, type } = req.body;

  //값이 하나라도 누락 됐을 때,
  if (!userIdx || !contents || !type) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: '입력값이 누락됐습니다.',
    });
  }

  // contents, type 형식 검사
  // contents 20글자 초과 불가
  if (contents.length > 20) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: '콘텐츠는 20글자 이하로 설정해주세요.',
    });
  }

  // type: do, decide, delete, delegate 중 하나가 맞는지 검사

  const validTypes = ['do', 'decide', 'delete', 'delegate'];
  if (!validTypes.includes(type)) {
    return res.send({
      isSuccess: false,
      code: 400,
      message: '유효한 타입이 아닙니다.',
    });
  }

  //전송받은 데이터를 mysql에 넣기 & 에러 메시지
  const insertTodoRow = await indexDao.insertTodo(userIdx, contents, type);

  if (!insertTodoRow) {
    return res.send({
      isSuccess: false,
      code: 403,
      message: '요청에 실패했습니다. 관리자에게 문의해주세요.',
    });
  }

  // 전부 다 정상적으로 동작했을 때,

  return res.send({
    isSuccess: true,
    code: 200,
    message: '일정 생성 성공',
  });
};
