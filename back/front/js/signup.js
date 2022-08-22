// ####### 토큰 검사

const token = localStorage.getItem('x-access-token');

if (token) {
  alert('로그아웃 후 이용해주세요.');
  location.href = 'index.html';
}

// ####### 토큰 검사

// 입력값 유효성 검사

// 이메일
const inputEmail = document.getElementById('email');
const emailMessage = document.querySelector('div.email-message');
inputEmail.addEventListener('input', isValidEmail);

// 비밀번호
const inputPassword = document.getElementById('password');
const passwordMessage = document.querySelector('div.password-message');
inputPassword.addEventListener('input', isValidPassword);

// 비밀번호 확인
const inputPasswordConfirm = document.getElementById('password-confirm');
const passwordConfirmMessage = document.querySelector(
  'div.password-confirm-message'
);
inputPasswordConfirm.addEventListener('input', isValidPasswordConfirm);

// 닉네임
const inputNickname = document.getElementById('nickname');
const nicknameMessage = document.querySelector('div.nickname-message');
inputNickname.addEventListener('input', isValidNickname);

// 이메일 형식 검사
function isValidEmail(event) {
  const currentEmail = inputEmail.value;

  const emailReg =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

  if (!emailReg.test(currentEmail)) {
    emailMessage.style.visibility = 'visible';
    return false;
  }
  emailMessage.style.visibility = 'hidden';
  return true;
}

//비밀번호 형식 검사
function isValidPassword(event) {
  const currentPassword = inputPassword.value;

  const passwordReg =
    /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?=[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{8,15}$/;

  if (!passwordReg.test(currentPassword)) {
    passwordMessage.style.visibility = 'visible';
    return false;
  }
  passwordMessage.style.visibility = 'hidden';
  return true;
}

// 비밀번호 확인 검사
function isValidPasswordConfirm(event) {
  const currentPassword = inputPassword.value;
  const currentPasswordConfirm = inputPasswordConfirm.value;
  console.log(currentPassword);

  if (currentPassword !== currentPasswordConfirm) {
    passwordConfirmMessage.style.visibility = 'visible';
    return false;
  }
  passwordConfirmMessage.style.visibility = 'hidden';
  return true;
}

// 닉네임 검사
function isValidNickname(event) {
  const currentNickname = inputNickname.value;
  console.log(currentNickname);

  if (currentNickname.length < 2 || currentNickname.length > 10) {
    nicknameMessage.style.visibility = 'visible';
    return false;
  }
  nicknameMessage.style.visibility = 'hidden';
  return true;
}

// ################ 회원가입 API 요청
const buttonSignup = document.getElementById('signup');
buttonSignup.addEventListener('click', signup);

async function signup(event) {
  // isValidReq는 모든 유효성 검사를 만족해야 true가 된다
  const isValidReq =
    isValidEmail() &&
    isValidPassword() &&
    isValidPasswordConfirm() &&
    isValidNickname();

  console.log(isValidReq);

  // isValidReq가 true일 때만 API 요청을 보낸다

  if (!isValidReq) {
    alert('회원 정보를 확인해주세요.');
    return false;
  }

  const currentEmail = inputEmail.value;
  const currentPassword = inputPassword.value;
  const currentNickname = inputNickname.value;

  const config = {
    method: 'post',
    url: url + '/user',
    data: {
      email: currentEmail,
      password: currentPassword,
      nickname: currentNickname,
    },
  };
  // html 구조상 common.js는 signup.js위에 위치하기 때문에, url 변수를 사용할 수 있다

  try {
    const res = await axios(config);

    //isSuccess 값을 보고 요청 실패 코드에 따라 컨트롤할 수 있는 함수를 만들수도 있다
    if (res.data.code === 400) {
      alert(res.data.message);
      //reload():새로고침
      location.reload();
      return false;
    }

    if (res.data.code === 200) {
      alert(res.data.message);
      //로그인 페이지로 이동
      location.href = 'signin.html';
      return true;
    }

    console.log(res);
  } catch (err) {
    console.error(err);
  }
}
