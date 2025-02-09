const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors"); // เพิ่ม CORS support
const app = express();

app.use(express.json());
app.use(cors()); // เปิดใช้งาน CORS

let db;
const client = new MongoClient("mongodb://localhost:27017");

client.connect().then(() => {
    db = client.db("stdb");
    console.log("MongoDB connected");
}).catch((err) => {
    console.error("MongoDB unconnect", err);
});

// ดึงข้อมูลนักศึกษาทั้งหมด
app.get('/students', async (req, res) => {
    try {
        const students = await db.collection("student").find().toArray();
        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error retrieving students" });
    }
});

// ดึงข้อมูลนักศึกษาตาม student ID หรือ Name
app.get('/students/search', async (req, res) => {
    try {
        const query = req.query.q; // ค้นหาจาก query parameter ?q=
        let student;

        if (!isNaN(query)) {
            // ถ้า query เป็นตัวเลข ให้ค้นหาจาก student ID
            student = await db.collection("student").findOne({ id: parseInt(query) });
        } else {
            // ถ้า query เป็น string ให้ค้นหาจาก name
            student = await db.collection("student").findOne({ name: query });
        }

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error retrieving student" });
    }
});

// เพิ่มข้อมูลนักศึกษาใหม่
app.post('/students', async (req, res) => {
    try {
        const { id, name } = req.body; // รับข้อมูลจาก Frontend
        if (!id || !name) {
            return res.status(400).json({ error: "Missing id or name" });
        }

        const student = await db.collection("student").insertOne({ id, name });
        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error inserting student" });
    }
});

// แก้ไขข้อมูลนักศึกษา
app.put('/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name } = req.body; // รับข้อมูลใหม่จาก Frontend

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid student ID" });
        }

        const student = await db.collection("student").updateOne(
            { "_id": new ObjectId(id) },
            { $set: { name } } // อัปเดตเฉพาะชื่อ
        );

        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error updating student" });
    }
});

// ลบข้อมูลนักศึกษา
app.delete('/students/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid student ID" });
        }

        const student = await db.collection("student").deleteOne({ "_id": new ObjectId(id) });
        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting student" });
    }
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});