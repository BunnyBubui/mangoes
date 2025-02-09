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
    console.log("MongoDB unconnect");
});

// ดึงข้อมูลนักศึกษาทั้งหมด
app.get('/students', async (req, res) => {
    try {
        const students = await db.collection("student").find().toArray();
        res.json(students);
    } catch (err) {
        res.json("error");
    }
});

// ดึงข้อมูลนักศึกษาตามรหัสนักศึกษา
app.get('/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const student = await db.collection("student").findOne({
            "_id": new ObjectId(id)
        });
        res.json(student);
    } catch (err) {
        res.json("error");
    }
});

// เพิ่มข้อมูลนักศึกษาใหม่
app.post('/students', async (req, res) => {
    try {
        const data = req.body;
        const student = await db.collection("student").insertOne(data);
        res.json(student);
    } catch (err) {
        res.json("error");
    }
});

// แก้ไขข้อมูลนักศึกษา
app.put('/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const student = await db.collection("student").updateOne({
            "_id": new ObjectId(id)
        }, {
            $set: data
        });
        res.json(student);
    } catch (err) {
        res.json("error");
    }
});

app.listen(3000, () => {
    console.log('Server started: success');
});
