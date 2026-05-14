const express = require("express");

console.log("STUDENT ROUTES LOADED");

const router = express.Router();

const db = require("../config/db");

// ================= LOGIN =================

router.post("/login", (req, res) => {

    const { username, password } = req.body;

    const sql =
        "SELECT * FROM users WHERE username = ? AND password = ?";

    db.query(sql, [username, password], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length > 0) {

            res.json({
                success: true,
                user: result[0]
            });

        } else {

            res.status(401).json({
                success: false,
                message: "Sai tài khoản"
            });
        }
    });
});

// ================= STUDENTS =================

// HIỂN THỊ SINH VIÊN

router.get("/students", (req, res) => {

    const sql = `
        SELECT
            id,
            student_code,
            name,
            cmnd,
            sdt,
            ngay_sinh,
            que_quan
        FROM students
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
});

// TÌM KIẾM SINH VIÊN

router.get("/students/search/:code", (req, res) => {

    console.log("SEARCH STUDENT RUNNING");

    const { code } = req.params;

    const sql = `
        SELECT * FROM students
        WHERE TRIM(LOWER(student_code)) = TRIM(LOWER(?))
        OR TRIM(LOWER(name)) LIKE TRIM(LOWER(?))
    `;

    db.query(
        sql,
        [
            code,
            `%${code}%`
        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json(err);
            }

            if (result.length === 0) {

                return res.status(404).json({
                    message: "Không tìm thấy sinh viên"
                });
            }

            res.json(result[0]);
        }
    );
});

// THÊM SINH VIÊN

router.post("/students", (req, res) => {

    const {
        student_code,
        name,
        cmnd,
        sdt,
        ngay_sinh,
        que_quan
    } = req.body;

    const sql = `
        INSERT INTO students
        (
            student_code,
            name,
            cmnd,
            sdt,
            ngay_sinh,
            que_quan
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            student_code,
            name,
            cmnd,
            sdt,
            ngay_sinh,
            que_quan
        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json(err);
            }

            res.json({
                success: true,
                message: "Thêm thành công"
            });
        }
    );
});

// SỬA SINH VIÊN

router.put("/students/:id", (req, res) => {

    const { id } = req.params;

    const {
        student_code,
        name,
        cmnd,
        sdt,
        ngay_sinh,
        que_quan
    } = req.body;

    const sql = `
        UPDATE students
        SET
            student_code = ?,
            name = ?,
            cmnd = ?,
            sdt = ?,
            ngay_sinh = ?,
            que_quan = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            student_code,
            name,
            cmnd,
            sdt,
            ngay_sinh,
            que_quan,
            id
        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json(err);
            }

            res.json({
                message: "Sửa thành công"
            });
        }
    );
});

// XÓA SINH VIÊN

router.delete("/students/:id", (req, res) => {

    const { id } = req.params;

    const sql =
        "DELETE FROM students WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json(err);
        }

        res.json({
            message: "Xóa thành công"
        });
    });
});

// ================= ROOMS =================

// HIỂN THỊ PHÒNG

router.get("/rooms", (req, res) => {

    db.query(
        "SELECT * FROM rooms",

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json(err);
            }

            res.json(result);
        }
    );
});

// TÌM KIẾM PHÒNG

router.get("/rooms/search/:code", (req, res) => {

    const { code } = req.params;

    const sql =
        "SELECT * FROM rooms WHERE ma_phong = ?";

    db.query(sql, [code], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json(err);
        }

        if (result.length === 0) {

            return res.status(404).json({
                message: "Không tìm thấy phòng"
            });
        }

        res.json(result[0]);
    });
});

// THÊM PHÒNG

router.post("/rooms", (req, res) => {

    const {
        ma_phong,
        ten_phong,
        ma_khu,
        loai_phong,
        so_nguoi_hien_tai,
        so_nguoi_toi_da
    } = req.body;

    const sql = `
        INSERT INTO rooms
        (
            ma_phong,
            ten_phong,
            ma_khu,
            loai_phong,
            so_nguoi_hien_tai,
            so_nguoi_toi_da
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            ma_phong,
            ten_phong,
            ma_khu,
            loai_phong,
            so_nguoi_hien_tai,
            so_nguoi_toi_da
        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json(err);
            }

            res.json({
                message: "Thêm phòng thành công"
            });
        }
    );
});

// ================= BILLS =================

// HIỂN THỊ HÓA ĐƠN

router.get("/bills", (req, res) => {

    const sql = `
        SELECT
            bills.id,
            rooms.ma_phong,
            bills.month,
            bills.electric,
            bills.water
        FROM bills
        JOIN rooms
        ON bills.room_id = rooms.id
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json(err);
        }

        res.json(result);
    });
});

// THÊM HÓA ĐƠN

router.post("/bills", (req, res) => {

    const {
        ma_phong,
        month,
        electric,
        water
    } = req.body;

    const findRoom =
        "SELECT id FROM rooms WHERE ma_phong = ?";

    db.query(findRoom, [ma_phong], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json(err);
        }

        if (result.length === 0) {

            return res.status(400).json({
                message: "Phòng không tồn tại"
            });
        }

        const room_id = result[0].id;

        const sql = `
            INSERT INTO bills
            (
                room_id,
                month,
                electric,
                water
            )
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                room_id,
                month,
                electric,
                water
            ],

            (err2, result2) => {

                if (err2) {

                    console.log(err2);

                    return res.status(500).json(err2);
                }

                res.json({
                    success: true,
                    message: "Thêm hóa đơn thành công"
                });
            }
        );
    });
});

module.exports = router;