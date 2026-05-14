const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: "123456",
  database: 'ktx_db',
  port : 3306
});

db.connect((err) => {
  if (err) {
    console.log('Lỗi kết nối DB:', err);
  } else {
    console.log('Kết nối DB thành công');
  }
});

module.exports = db;