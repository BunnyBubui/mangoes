const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors"); // เพิ่ม CORS support
const app = express();

app.use(express.json());
app.use(cors()); // เปิดใช้งาน CORS

let db;
const client = new MongoClient("mongodb://localhost:27017");

client.connect().then(() => {
    db = client.db("university");
    console.log("MongoDB connected");
}).catch((err) => {
    console.error("MongoDB unconnected", err);
});

// ดึงข้อมูลนักศึกษาทั้งหมด
app.get('/students', async (req, res) => {
    try {
      const students = await db.collection("students").find().toArray();
      res.json(students);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error retrieving students" });
    }
  });
  
  // เพิ่มข้อมูลนักศึกษาใหม่
  app.post('/students', async (req, res) => {
    try {
      const { id, name, major, gpa } = req.body; // รับข้อมูลจาก Frontend
      if (!id || !name || !major || !gpa) {
        return res.status(400).json({ error: "Missing id, name, major, or GPA" });
      }
  
      const student = await db.collection("students").insertOne({ id, name, major, gpa });
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
      const { name, major, gpa } = req.body;
  
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid student ID" });
      }
  
      const student = await db.collection("students").updateOne(
        { "_id": new ObjectId(id) },
        { $set: { name, major, gpa } } // อัปเดตชื่อ, สาขาวิชา และ GPA
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

        const student = await db.collection("students").deleteOne({ "_id": new ObjectId(id) });  // เปลี่ยนจาก "student" เป็น "students"
        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting student" });
    }
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
