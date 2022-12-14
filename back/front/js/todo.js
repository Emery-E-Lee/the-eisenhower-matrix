// const { createTodo } = require('../../node/src/controller/indexController');

// const { updateTodo } = require('../../node/src/controller/indexController');

// const { url } = require('inspector');

readTodo();

async function readTodo() {
  // 회원용 기능이므로 토큰이 없으면 return
  const token = localStorage.getItem('x-access-token');
  if (!token) {
    return;
  }

  // 일정 조회 API 호출하기
  const config = {
    method: 'get',
    url: url + '/todos',
    headers: { 'x-access-token': token },
  };

  try {
    const res = await axios(config);
    if (res.data.code !== 200) {
      alert(res.data.message);
      return false;
    }

    const todoDataSet = res.data.result;

    for (let section in todoDataSet) {
      // 각 섹션에 해당하는 ul 태그 선택
      //백틱을 사용할 때는 id값 앞에 '#'을 넣어줘야한다
      const sectionUl = document.querySelector(`#${section} ul`);

      // 각 섹션에 해당하는 데이터
      const arrayForEachSection = todoDataSet[section];

      let result = '';
      for (let todo of arrayForEachSection) {
        let element = `<li class="list-item" id=${todo.todoIdx}>
                          <div class="done-text-container">
                            <input type="checkbox" class="todo-done" ${
                              todo.status === 'C' ? 'checked' : ''
                            }/>
                              <p class="todo-text">${todo.contents}</p>
                          </div>
                          <!-- done-text-container -->
                          <div class="update-delete-container">
                              <i class="todo-update fa-solid fa-pen-to-square"></i>
                              <i class="todo-delete fa-solid fa-trash-can"></i>
                          </div>
                        </li>`;

        result += element;
      }

      sectionUl.innerHTML = result;
    }
  } catch (err) {
    console.error(err);
  }
}

// 일정 CUD

const matrixContainer = document.querySelector('.matrix-container');
matrixContainer.addEventListener('keypress', cudController);
matrixContainer.addEventListener('click', cudController);

function cudController(event) {
  const token = localStorage.getItem('x-access-token');
  if (!token) {
    return;
  }

  const target = event.target;
  const targetTagName = target.tagName;
  const eventType = event.type;
  const key = event.key;

  console.log(target, targetTagName, eventType, key);

  // create 이벤트 처리
  if (targetTagName === 'INPUT' && key === 'Enter') {
    createTodo(event, token);
    return; // 한 이벤트에 걸리면, 다른 이벤트를 실행할 필요가 없음
  }

  // update 이벤트 처리
  // li 태그 내부에서 input checkbox가 선택되거나 i태그가 선택 될 때, 업데이트돼야 함

  if (target.className === 'todo-done' && eventType === 'click') {
    updateTodoDone(event, token);
    return;
  }

  // 컨텐츠 업데이트
  const firstClassName = target.className.split(' ')[0];
  // class 중 todo-update만 필요하므로, split으로 잘라 [0]번째 요소만 넣는다
  if (firstClassName === 'todo-update' && eventType === 'click') {
    updateTodoContents(event, token);
    return;
  }

  // delete 이벤트 처리
  if (firstClassName === 'todo-delete' && eventType === 'click') {
    deleteTodo(event, token);
    return;
  }
}

async function createTodo(event, token) {
  const contents = event.target.value;
  //closest(선택자): 선택자에 부합하는 가장 가까운 부모 요소 반환
  const type = event.target.closest('.matrix-item').id;

  if (!contents) {
    alert('내용을 입력해주세요.');
    return false;
  }

  const config = {
    method: 'post',
    url: url + '/todo',
    headers: { 'x-access-token': token },
    data: {
      contents: contents,
      type: type,
    },
  };

  try {
    const res = await axios(config);

    if (res.data.code !== 200) {
      alert(res.data.message);
      return false;
    }

    // DOM 업데이트
    readTodo();
    event.target.value = '';
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function updateTodoDone(event, token) {
  const status = event.target.checked ? 'C' : 'A';
  const todoIdx = event.target.closest('.list-item').id;

  const config = {
    method: 'patch',
    url: url + '/todo',
    headers: { 'x-access-token': token },
    data: {
      todoIdx: todoIdx,
      status: status,
    },
  };

  try {
    const res = await axios(config);

    if (res.data.code !== 200) {
      alert(res.data.message);
      return false;
    }

    // DOM 업데이트 (업데이트한 상태 유지)
    readTodo();
    event.target.value = '';
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function updateTodoContents(event, token) {
  const contents = prompt('내용을 입력해주세요.');
  const todoIdx = event.target.closest('.list-item').id;

  const config = {
    method: 'patch',
    url: url + '/todo',
    headers: { 'x-access-token': token },
    data: {
      todoIdx: todoIdx,
      contents: contents,
    },
  };

  try {
    const res = await axios(config);

    if (res.data.code !== 200) {
      alert(res.data.message);
      return false;
    }

    // DOM 업데이트 (업데이트한 상태 유지)
    readTodo();
    event.target.value = '';
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function deleteTodo(event, token) {
  const isValidReq = confirm(
    '삭제하시겠습니까? 삭제 후에는 복구가 어렵습니다.'
  );

  if (!isValidReq) {
    return false;
    // yes가 아니면 함수 종료
  }

  const todoIdx = event.target.closest('.list-item').id;

  const config = {
    method: 'delete',
    url: url + `/todo/${todoIdx}`,
    headers: { 'x-access-token': token },
  };

  try {
    const res = await axios(config);

    if (res.data.code !== 200) {
      alert(res.data.message);
      return false;
    }

    // DOM 업데이트 (업데이트한 상태 유지)
    readTodo();
    event.target.value = '';
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
