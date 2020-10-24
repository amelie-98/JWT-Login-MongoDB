import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import auth from './middleware/auth';
import userRoutes from './routes/user';

const app = express();

require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// nếu token đúng thì chạy tiếp hàm là tham số thứ 3
// auth là middleware
app.get('/api/protected', auth, (req, res) => {
  res.send(`Hi ${req.user.firstName} ,you are authenticated!`);
});

app.use('/api/users', userRoutes);

// app.use mà không truyền đường dẫn vào thì sẽ luôn chạy khi các router ở ở trên nó không khớp url hoặc router ở ngay trên nó chạy next()
// cái app.use này sẽ chạy khi các router ở trên nó không khớp url
// khi router ở trên nó chạy hàm next thì hàm này sẽ không chạy vì ta không truyền đủ 4 tham số cho nó
app.use((req, res, next) => {
  const err = new Error('not found');
  err.status = 404;
  next(err);
});
// cái app.use này sẽ chạy khi có router ở trên nó chạy hàm next vì ta đã truyền cho nó đủ 4 tham số
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message,
    },
  });
});

mongoose
  .connect(process.env.URL_DB, { useNewUrlParser: true })
  .then(() => {
    return app.listen(process.env.PORT_GATE, () => console.log(`Running On Port ${process.env.PORT_GATE}`));
  })
  .catch((err) => console.log(err));
