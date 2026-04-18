const express = require("express");
const router = express.Router();
const db = require("../config/db");

// --- PHẦN LOGIN ---
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

// --- QUẢN LÝ SINH VIÊN ---
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

// --- QUẢN LÝ PHÒNG ---
router.get("/rooms", (req, res) => {
    db.query("SELECT * FROM rooms", (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        return res.json(result);
    });
});

router.put("/rooms/:id", (req, res) => {
    const { id } = req.params;
    const { ma_phong, ten_phong, ma_khu, loai_phong, so_nguoi_hien_tai, so_nguoi_toi_da } = req.body;
    const sql = "UPDATE rooms SET ma_phong=?, ten_phong=?, ma_khu=?, loai_phong=?, so_nguoi_hien_tai=?, so_nguoi_toi_da=? WHERE id=?";
    db.query(sql, [ma_phong, ten_phong, ma_khu, loai_phong, so_nguoi_hien_tai, so_nguoi_toi_da, id], (err, result) => {
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

// --- QUẢN LÝ HÓA ĐƠN (BILLS) ---

// 📋 LẤY DANH SÁCH HÓA ĐƠN (Đã sửa lỗi hiển thị chữ Mã Phòng)
router.get("/bills", (req, res) => {
    // Sửa lỗi: Thêm dấu phẩy sau bills.* và sửa tên bảng room -> rooms
    const sql = "SELECT bills.*, rooms.ma_phong FROM bills JOIN rooms ON bills.room_id = rooms.id";
    db.query(sql, (err, result) => {
        if (err) {
            console.log("GET BILLS ERROR:", err);
            return res.status(500).json(err);
        }
        res.json(result);
    });
});

// 💾 THÊM HÓA ĐƠN MỚI
router.post("/bills", (req, res) => {
    const { ma_phong, month, electric, water } = req.body;

    // 1. Tìm id phòng từ mã phòng (chữ) người dùng nhập
    const findRoom = "SELECT id FROM rooms WHERE ma_phong = ?";
    db.query(findRoom, [ma_phong], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.length === 0) {
            return res.status(400).json({ message: "Phòng không tồn tại" });
        }

        const room_id = result[0].id;

        // 2. Lưu vào bảng bills sử dụng room_id vừa tìm được
        const insertSql = "INSERT INTO bills (room_id, month, electric, water) VALUES (?, ?, ?, ?)";
        db.query(insertSql, [room_id, month, electric, water], (err2, result2) => {
            if (err2) {
                console.log("INSERT BILL ERROR:", err2);
                return res.status(500).json(err2);
            }
            res.json({ message: "Thêm hóa đơn thành công", success: true });
        });
    });
});

module.exports = router;