const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'contactuser',
    password: 'Password123',
    database: 'contactdb'
});

db.connect((err) => {

    if (err) {
        console.error(err);
        process.exit(1);
    }

    console.log("Database connected");
});

db.query(`
CREATE TABLE IF NOT EXISTS contacts(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(20),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`, (err) => {

    if (err) {
        console.error(err);
    }
});

app.get('/contacts', (req, res) => {

    db.query(
        "SELECT * FROM contacts",
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);
        }
    );
});

app.post('/contacts', (req, res) => {

    const { name, email, message } = req.body;

    db.query(
        "INSERT INTO contacts(name, email, message) VALUES (?, ?, ?)",
        [name, email, message],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Inserted",
                id: result.insertId
            });
        }
    );
});

app.delete('/contacts/:id', (req, res) => {

    db.query(
        "DELETE FROM contacts WHERE id=?",
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.affectedRows === 0) {
                return res.status(404).send("Not found");
            }

            res.send("Deleted");
        }
    );
});

app.listen(3000, () => {
    console.log("Running on port 3000");
});
