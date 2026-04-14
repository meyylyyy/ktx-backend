const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, error: err });
        }
        if (result.length > 0) {
            res.json({ success: true, message: "Login success", user: result[0] });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    });
});

router.get("/students", (req, res) => {
    db.query("SELECT * FROM students", (err, result) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json(result);
        }
    });
});

router.post("/students", (req, res) => {
    const { name, student_code, gender, room_id } = req.body;
    const sql = "INSERT INTO students (name, student_code, gender, room_id) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, student_code, gender, room_id], (err, result) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json({ message: "Success" });
        }
    });
});

router.put("/students/:id", (req, res) => {
    const { id } = req.params;
    const { name, student_code, gender, room_id } = req.body;
    const sql = "UPDATE students SET name=?, student_code=?, gender=?, room_id=? WHERE id=?";
    db.query(sql, [name, student_code, gender, room_id, id], (err, result) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json({ message: "Updated" });
        }
    });
});

router.delete("/students/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM students WHERE id=?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json({ message: "Deleted" });
        }
    });
});
// LẤY DANH SÁCH PHÒNG
router.get("/rooms", (req, res) => {
    console.log("API ROOMS OK");
  db.query("SELECT * FROM rooms", (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    return res.json(result);
  });
});
router.post("/rooms", (req, res) => {
  const { ma_phong, ten_phong, ma_khu, loai_phong, so_nguoi_hien_tai, so_nguoi_toi_da } = req.body;

  const sql = `
    INSERT INTO rooms 
    (ma_phong, ten_phong, ma_khu, loai_phong, so_nguoi_hien_tai, so_nguoi_toi_da)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [ma_phong, ten_phong, ma_khu, loai_phong, so_nguoi_hien_tai, so_nguoi_toi_da], 
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Thêm thành công" });
  });
});
router.put("/rooms/:id", (req, res) => {
  const { id } = req.params;
  const { ma_phong, ten_phong, ma_khu, loai_phong, so_nguoi_hien_tai, so_nguoi_toi_da } = req.body;

  const sql = `
    UPDATE rooms SET 
    ma_phong=?, ten_phong=?, ma_khu=?, loai_phong=?, 
    so_nguoi_hien_tai=?, so_nguoi_toi_da=?
    WHERE id=?
  `;

  db.query(sql, [ma_phong, ten_phong, ma_khu, loai_phong, so_nguoi_hien_tai, so_nguoi_toi_da, id], 
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Sửa thành công" });
  });
});
router.delete("/rooms/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM rooms WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Xóa thành công" });
  });
});

module.exports = router;