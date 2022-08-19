// // 로컬스토리지 데이터 생성
// localStorage.setItem('x-access-token', 'dummy token');

// // 로컬스토리지 데이터 조회
// console.log(localStorage.getItem('x-access-token'));

// //로컬스토리지 데이터 삭제
// localStorage.removeItem('x-access-token');

const buttonSignin = document.getElementById('signin');
const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');

buttonSignin.addEventListener('click', signin);

// 로그인 처리 함수
async function signin(event) {
  const currentEmail = inputEmail.value;
  const currentPassword = inputPassword.value;

  if (!currentEmail || !currentPassword) {
    return false;
  }

  // 로그인 api 요청
  const config = {
    method: 'post',
    url: url + '/sign-in',
    data: {
      email: currentEmail,
      password: currentPassword,
    },
  };

  try {
    const res = await axios(config);

    if (res.data.code !== 200) {
      alert(res.data.message);
      return false;
    }

    localStorage.setItem('x-access-token', res.data.result.token);
    alert(res.data.message);
    location.href = 'index.html';
    return true;

    console.log(res);
  } catch (err) {
    console.error(err);
  }
}
