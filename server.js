const express = require("express");
require("dotenv").config();

const {todoService, todoServiceById} = require("./services/todoService");

const app = express();

// For localhost:3000/
app.get("/", (req, res, next) => {
    res.status(200).send("Service is Up")
});

// get external service
// http://localhost:3000/todo
app.get("/todo", (req, res, next) => {
    todoService()
    .then(result => res.status(200).json(result))
    .catch(err => res.status(501).json({
        error: {
            message:err.message,
            status: err.status
        }
    }));
});

// get external service by ID
// http://localhost:3000/todo/56
app.get("/todo/:todoId", (req, res, next) => {
    const todoId = req.params.todoId;
    todoServiceById(todoId)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(err.status || 501).json({
        error: {
            message: error.message, 
            status: error.status, 
            method: req.method
        }
    }));
});

//middleware modules for Error Handling
app.use((req, res, next) => {
    const error = new Error("NOT FOUND");
    error.status = 404;
    next(error);
});

//middleware modules to send Error neatly
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message, 
            status: error.status,
            method: req.method
        }
    });
});


app.listen(process.env.port, () => {
    console.log(`Server starting on port ${process.env.port}`);
})