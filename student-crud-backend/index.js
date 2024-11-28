const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => res.send('API is working'));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

const mysql = require("mysql2");
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "quanlysach"
});

db.connect(err => {
    if(err) throw err;
    console.log("Connected to database");
})

app.get('/students', (req, res) => {
    db.query('SELECT * FROM students', (err, result) => {
        if(err) return res.status(500).send(err);
        res.json(result);
    });
});

app.post('students', (req, res) => {
    const {name, age, class: studentClass} = req.body;
    const sql = 'INSERT INTO students (name, age, class) VALUES (?, ?, ?)';
    db.query(sql, [name, age, studentClass], (err, result) => {
        if(err) return res.status(500).send(err);
        res.status(201).send('Student created successfully');
    });
});

app.put('students/:id', (req, res)=> {
    const {id} = req.params;
    const {name, age, class: studentClass} = req.body;
    const sql = 'UPDATE students SET name = ?, age = ?, class = ? WHERE id = ?';
    db.query(sql, [name, age, studentClass, id], (err, result) => {
        if(err) return res.status(500).send(err);
        res.status(200).send('Student updated successfully');
    });
});

app.delete('/students/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM students WHERE id = ?', [id], (err, result) => {
      if (err) return res.status(500).send(err);
      res.send('Student deleted!');
    });
  });