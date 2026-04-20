const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host:'localhost',
  user:'contactuser',
  password:'Password123',
  database:'contactsdb'
});

db.connect();

db.query(`
CREATE TABLE IF NOT EXISTS contacts(
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
phone VARCHAR(20)
)`);

app.get('/contacts',(req,res)=>{
    db.query("SELECT * FROM contacts",(err,result)=>{
        res.json(result);
    });
});

app.post('/contacts',(req,res)=>{
    const {name,phone}=req.body;
    db.query(
      "INSERT INTO contacts(name,phone) VALUES (?,?)",
      [name,phone]
    );
    res.send("Inserted");
});

app.delete('/contacts/:id',(req,res)=>{
   db.query(
     "DELETE FROM contacts WHERE id=?",
     [req.params.id]
   );
   res.send("Deleted");
});

app.listen(3000,()=>console.log("Running"));
