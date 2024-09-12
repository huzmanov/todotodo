const express = require('express')
const app = express()
const port = 3000
const pgp = require('pg-promise')();

require('dotenv').config();

const DataBase = process.env.PG_DATABASE
const UserName = process.env.PG_USER
const Password = process.env.PG_PASSWORD
const Host = process.env.PG_HOST
const Port = process.env.PG_PORT

const db = pgp(`postgresql://${UserName}:${Password}@${Host}:${Port}/${DataBase}?ssl=true`);

const path = require('path');
const cors = require('cors');
const short_uuid = require('short-uuid');

const bp = require('body-parser');
const { error } = require('console');
const json = bp.json()


// Serve html file to server
// Link: https://www.digitalocean.com/community/tutorials/use-expressjs-to-deliver-html-files

app.use(cors())

app.use(express.static('./public'));
app.use(bp.json());

app.get('/', function (request, response) {
  response.setHeader("Access-Control-Allow-Origin", '*')
  response.sendFile(path.join(__dirname, './public/html/todo.html'));
  // response.json({ apiUrl: process.env.devUrl });
});


// GET LIST OF COMPLETE TASKS
// GET LIST OF COMPLETE TASKS
// GET LIST OF COMPLETE TASKS

app.get('/completedtasks', json, (request, response) => {
  const query = `SELECT * FROM TODO WHERE STATUS = 'Complete' order by due_date`
  db.any(query)
    .then((data) => {
      response.json(data)
    })
    .catch((error) => {
      console.log('Error:', error)
    })
})

// GET LIST OF PROGRESS TASKS
// GET LIST OF PROGRESS TASKS
// GET LIST OF PROGRESS TASKS

app.get('/progresstasks', json, (request, response) => {
  const query = `SELECT * FROM TODO WHERE STATUS = 'In-Progress' order by due_date`
  db.any(query)
    .then((data) => {
      response.json(data)
    })
    .catch((error) => {
      console.log('Error:', error)
    })
})

//SELECT LATEST ADDED TODO
//SELECT LATEST ADDED TODO
//SELECT LATEST ADDED TODO
app.get('/todo_latest', json, (request, response) => {

  const query = `SELECT * FROM todo WHERE creation_date = (SELECT MAX(creation_date) FROM todo);`
  db.any(query)
    .then((data) => {
      response.json(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
    })
})


//INSERT NEW TASK
//INSERT NEW TASK
//INSERT NEW TASK
app.post('/todo', (request, response) => {

  const id = short_uuid.generate()
  const title = request.body.title
  const description = request.body.description
  const status = "In-Progress"
  const creationDate = Date.now()
  const due_date = request.body.due_date
  const last_modified_date = Date.now()

  const query = `INSERT INTO TODO (id, creation_Date, title, description, status, due_date, last_modified_date) VALUES('${id}', '${creationDate}', '${title}', '${description}', '${status}', '${due_date}', '${last_modified_date}' )`;
  // console.log('This is it:', query)

  db.none(query)
    .then((data) => {
      response.json(data)
      // do if check compare number of data in the database to the number of data in the html
    })
    .catch((error) => {
      console.log('ERROR:', error)
    })
})


//UPDATE TASK DETAILS
//UPDATE TASK DETAILS
//UPDATE TASK DETAILS
app.post('/update_task', (request, response) => {
  var id = request.body.id
  var title = request.body.send_title
  var description = request.body.send_description
  var due_date = request.body.send_dueDate

  const query = `UPDATE TODO SET title = '${title}', description = '${description}', due_date = '${due_date}' WHERE id = '${id}' `
  db.none(query)
    .then((data) => {
      response.json(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
    })
})


// SET STATUS TO COMPLETE
// SET STATUS TO COMPLETE
// SET STATUS TO COMPLETE
app.post('/statuscomplete', (request, response) => {
  var id = request.body.id
  const query = `UPDATE TODO SET STATUS = 'Complete' WHERE ID = '${id}'`
  db.none(query)
    .then((data) => {
      response.json(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
    })
})

//SET STATUS TO IN-PROGRESS
//SET STATUS TO IN-PROGRESS
//SET STATUS TO IN-PROGRESS
app.post('/statusinprogress', (request, response) => {
  var id = request.body.id
  const query = `UPDATE TODO SET STATUS = 'In-Progress' WHERE ID = '${id}'`
  db.none(query)
    .then((data) => {
      response.json(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
    })
})

//DELETE TASK
//DELETE TASK
//DELETE TASK
app.delete('/todo', json, (request, response) => {

  const id = request.body.id

  const query = `DELETE FROM TODO WHERE id = '${id}'`
  db.any(query)
    .then((data) => {
      response.json(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
    })

})


app.listen(port, () => {
  console.log(`App is litening on localhost:${port}`)
})