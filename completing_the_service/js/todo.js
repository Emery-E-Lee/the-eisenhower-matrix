// const { createTodo } = require('../../node/src/controller/indexController');

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
