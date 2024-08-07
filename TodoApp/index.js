const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const env = require("dotenv");


const app =  express();
const port = 3400;
app.use(cors());
app.use(express.json());
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static("public"));
env.config();

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});
db.connect();

// get all todos
app.get("/todos", async(req, res) => {
    try{
        const allTodos = await db.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    }catch(err){
        console.error(err.message)
    }
})

// GET A SPECIFIC TODO
app.get("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const todo = await db.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
        res.json(todo.rows[0]);
    } catch (error) {
        console.error(err)
    }
});

//UPDATE A TODO
app.put("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updateTodo = await db.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id]);
        res.json("Todo Updateds")
    } catch (error) {
        console.error(err)
    }
})

// DELETE TODO
app.delete("/todos/:id", async(req, res) =>{
    try {
        const { id } = req.params;
        const deleteTodo = await db.query("DELETE FROM todo WHERE todo_id = $1", [id]);
        res.json("DELETED");
    } catch (error) {
        console.error(error.message)
    }
})


// POST TODO
app.post("/todos", async (req, res) =>{
    try{
        const { description } = req.body;
        const newTodo = await db.query("INSERT INTO todo (description) VALUES($1) RETURNING * ", [description]);
        res.json(newTodo.rows[0]);
    } catch(err){
        console.error(err.message);
    }
})

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
})