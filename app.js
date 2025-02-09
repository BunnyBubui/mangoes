const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();

app.use(express.json());
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

// ดึงข้อมูลนักศึกษาตาม student ID (ค้นหาจากฟิลด์ student)
app.get('/students/student/:student', async (req, res) => {
    try {
        let studentId = req.params.student;
        if (!isNaN(studentId)) {
            studentId = parseInt(studentId); 
        }

        const student = await db.collection("student").findOne({ student: studentId });

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
        const data = req.body;
        const student = await db.collection("student").insertOne(data);
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
        const data = req.body;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid student ID" });
        }

        const student = await db.collection("student").updateOne(
            { "_id": new ObjectId(id) },
            { $set: data }
        );

        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error updating student" });
    }
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
