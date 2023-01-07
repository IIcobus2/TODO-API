const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(req, res, next) {
    const { username } = req.headers
    if(!users) res.status(400).json({error: "There is NOT users available"})
    

    const userFound = users.find((user) => username ===  user.username)
    if(!userFound) res.status(404).json({error: "User not found"})
 
    req.user = userFound
    next()
}

app.post('/users', (req, res) => {
    const { name, username } = req.body

    users.push({ id: uuidv4(), name, username, todo: [] })

    res.status(201).json(users)
});

app.get('/todos', checksExistsUserAccount, (req, res) => {
    const { user } = req

    res.status(201).json(user)
});

app.post('/todos', checksExistsUserAccount, (req, res) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (req, res) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (req, res) => {
  // Complete aqui   
});

app.delete('/todos/:id', checksExistsUserAccount, (req, res) => {
  // Complete aqui
});

module.exports = app;