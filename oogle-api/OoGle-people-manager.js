/************************************************************************
* A RESTful API in JavaScript using the express toolkit
*
* @author Mathew Charath and Nick Pydyn
* @date December 7, 2018
************************************************************************/

// The API toolkit for making REST systems easily
const express = require('express');

// A good solution for handling JSON data in routes
const bodyParser = require('body-parser');

// Node JS modules for filesystem access
const fs = require('fs');

// Our database connection
// This will be a JSON object of our programmers
// and can be accessed as if it was any other javascript
// object
const database = require('./programmers.json');

// keys of the objects in database
const keys = Object.keys(database);

// database as an array
const dba = [database]

// Make an instance of our express application
const app = express();

// Specify our > 1024 port to run on
const port = 3000;

// Apply our middleware so our code can natively handle JSON easily
app.use(bodyParser.json());

// We must have our list of programmers to use
if (!fs.existsSync('./programmers.json')) {
  throw new Error('Could not find database of programmers!');
}

// Build our routes

/**************************************************************************
* Route for a GET request that sends back all the data in the JSON
**************************************************************************/
app.get('/', (req, res) => {
  res.send(dba);
});


/**************************************************************************
* Route for a GET request that sends back the keys of the objects
* in the database
**************************************************************************/
app.get('/keys', (req,res) => {
  res.send(keys)
});

/*************************************************************************
* Route for a GET request that sends back the object for the given ID
*************************************************************************/
app.get('/:id', (req, res) => {
  const id = req.params.id;
  var slaves = [];
  dba.forEach(s => {
    if(s.SID == id){
      slaves.push(s);
    }
  });

  if(slaves.length == 0){
    res.send(`Error`);
  }else{
    res.send(slaves);
  }

  //res.send(`Fill me in to return values with ID: ${id}`);
});

/************************************************************************
* Route for a PUT request to change the object with the given ID
************************************************************************/
app.put('/:id', (req, res) => {
  const id = req.params.id;

  const body = req.body; // Hold your JSON in here!
  const bKey = Object.keys(body);

  dba.forEach(s => {
    if(s.SID == id){
      keys.forEach(k => {
        if (body[k]) {
          s[k] = body[k];
        }
        else {
          s[k] = "";
        }
       });
     }
   });

  res.send(`Update values with ID: ${id}`);
});

/***********************************************************************
* Route for a POST request to add the given data as a new object to
* the database
***********************************************************************/
app.post('/new', (req, res) => {

  // terminal command to add to data to json via a POST request:
  // curl --header "Content-Type: application/json" --request POST \
  // --data '{"firstName":"Name", "lastName":"surname", "SID":"001","goodSlave": "true"}' \
  // http://localhost:3000/new

  const body = req.body; // Hold your JSON in here!
  const bKey = Object.keys(body);

  let data = {};
  keys.forEach(k => {
    if (body[k]) {
      data[k] = body[k];
    }
    else {
      data[k] = "";
    }
  });
  dba.push(data);

  res.send(`You sent: ${body}`);
});

// IMPLEMENT A ROUTE TO HANDLE ALL OTHER ROUTES AND RETURN AN ERROR MESSAGE

/**************************************************************************
* A route to to handle all other request that sends `Error`
**************************************************************************/
app.all('/*', (req,res) => {
  res.send(`Error`);
});


app.listen(port, () => {
  console.log(`She's alive on port ${port}`);
});
