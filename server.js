import path from 'path';
import express from 'express';
import fs from 'graceful-fs';
import bodyParser from 'body-parser';

const appName = "banking"
const dataFilesDir = process.env.HOME + '/.' + appName;
const overviewFile = dataFilesDir + "/overview.json"
const categoriesFile = dataFilesDir + "/categories.json"
const filtersFile = dataFilesDir + "/filters.json"
// Initialize data files.
if( !fs.existsSync(dataFilesDir) ) {
  fs.mkdir(dataFilesDir, (err) => {
    if(err != null) {
      console.log("Unable to create app directory.");
      console.log("Error: ", err);
      process.exit(1);
    }
    let fileErrHandling = (err) => {
      if(err != null){
        console.log("Unable to create data file.");
        console.log("Error: ", err);
        process.exit(1);
      }
    }
    fs.writeFile(overviewFile, '', fileErrHandling)
    fs.writeFile(categoriesFile, '', fileErrHandling)
    fs.writeFile(filtersFile, '', fileErrHandling)
  });
}

const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

let readFile = (fileName) => {
  return (req, res) => {
     fs.readFile(fileName, (err, data) => {
       if(data == null){
         res.json([]);
         return;
       }
       res.json(JSON.parse(data));
     });
   }
 }

let writeFile = (fileName) => {
  return (req, res) => {
    fs.writeFile(fileName, JSON.stringify(req.body), (err) => {
      if(err != null){
        console.log(`Failed to write data. Data: ${req.body}, Err: ${err}`);
        res.status(400).send("Bad Request");
        return;
      }

      res.status(201).send();
    })
  }
}

app.get('/api/v1/transactions', readFile(overviewFile));

app.get('/api/v1/filters', readFile(filtersFile));

app.get('/api/v1/categories', readFile(categoriesFile));

app.post('/api/v1/transactions', writeFile(overviewFile));

app.post('/api/v1/filters', writeFile(filtersFile));

app.post('/api/v1/categories', writeFile(categoriesFile));

app.get('/', function response(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

var server = app.listen(8080, function () {
     var host = server.address().address
     var port = server.address().port

     console.log("Example app listening at http://localhost:%s", host, port)
});
