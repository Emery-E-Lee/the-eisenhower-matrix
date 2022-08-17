const compression = require('compression');
const cors = require('cors');
const { indexRouter } = require('./src/router/indexRouter');

const express = require('express');
const app = express();
const port = 3000;

/* express  미들웨어 설정 */
// cors 설정: 공부 단계라 보안은 느슨하게 해 둠
app.use(cors());

// body json 파싱: 클라이언트에게서 데이터 패키지를 받을 때, 거기서 body를 찾아내고 json 값을 파싱할 수 있게 함
app.use(express.json());

// HTTP 요청 압축
app.use(compression());

// 라우터 분리
indexRouter(app);

//get(uri, callback 함수), callback 함수는 req, res 두 개의 파라미터를 받는다.
// req: 클라이언트에서 서버로 요청하는 객체, res: 서버가 클라이언트에게 응답해주는 객체
app.post('/user', function (req, res) {
  const name = req.body.name;
  return res.send(name);
});

app.listen(port, () => {
  console.log(`Express app listening at port: ${port}`);
});
