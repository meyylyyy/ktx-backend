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

module.exports = router;