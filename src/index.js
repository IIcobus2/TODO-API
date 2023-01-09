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
    

    if(users.some((user) => user.username === username)) return res.status(400).json({error: 'User already exists'})
    users.push({ id: uuidv4(), name, username, todos: [] })
    const user = users.find((user) => username === user.username)
    res.status(201).json({name: user.name, username:user.username, todos:user.todos})
});

app.get('/todos', checksExistsUserAccount, (req, res) => {
    const { user } = req

    res.status(201).json(users)
});

app.post('/todos', checksExistsUserAccount, (req, res) => {
    const { title } = req.body
    const { user } = req

    const deadline = new Date().toISOString().split('T')[0]

    user.todos.push({ id: uuidv4(), title, done: false, deadline: deadline, created_at: new Date()})

    res.status(201).json(users)
});

app.put('/todos/:id', checksExistsUserAccount, (req, res) => {
    const { title, deadline } = req.body
    const { id } = req.params
    const { user } = req

   const found = user.todos.find((todo) => todo.id === id)

   if(!found){
       return res.status(404).json({error: "Todo NOT found"})
   }
    found.title = title
    found.deadline = deadline
    res.status(201).json(found)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (req, res) => {
    const { id } = req.params
    const { user } = req

   const found = user.todos.find((todo) => todo.id === id)

   if(!found){
       return res.status(404).json({error: "Todo NOT found"})
   }
    found.done = true
    res.status(201).json(found)
});

app.delete('/todos/:id', checksExistsUserAccount, (req, res) => {
    const { id } = req.params
    const { user } = req

   const found = user.todos.find((todo) => todo.id === id)

   if(!found){
       return res.status(404).json({error: "Todo NOT found"})
   }
    user.todos.splice(user.todos.indexOf(found), 1)
    res.status(201).json(user)

});

module.exports = app;