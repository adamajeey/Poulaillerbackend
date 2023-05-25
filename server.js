express = require('express');
path = require('path');
mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID;
createError = require('http-errors')
cors = require('cors');
bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const temper = require('./model/temphum');
const heure = require('./model/heure')

const databaseLink = process.env.DATABASE_URL;
mongoose.connect(databaseLink);
const database = mongoose.connection;
var url = "mongodb+srv://Adama:gahdamns@cluster0.9gldina.mongodb.net/Poulailler?retryWrites=true&w=majority";

//Here we will avoid Mongoose warming (strictQuery will be 'false')
mongoose.set('strictQuery', true);

//Here we are connecting to data base mongoDb by mongoose
mongoose.connect('mongodb+srv://Adama:gahdamns@cluster0.9gldina.mongodb.net/Poulailler?retryWrites=true&w=majority',
  //mongoose.connect( "mongodb+srv://papa:2605@cluster0.wepa2rr.mongodb.net/homestead?retryWrites=true&w=majority", 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échoué !'));

//Here are adding the constant 'app' using express


//Here are managing body requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
//Here are managing CORS sécurity
app.use(cors({ origin: "*" }));


//Here we are managing endpoint for access to user model
const userRoute = require('./routes/route');
app.use('/api', userRoute);

//Here we are managing server's port (using which are giving by the system or 3000)
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log('Port connected to: ' + port)
});

//initialisation socket
io = require('socket.io')(server,
  {
    cors:
    {
      origin: "*",
      methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
      credentials: false
    }
  });

//this middelware catch errors when the URL for endpoint is not correct and send them to the next
app.use((req, res, next) => {
  next((404))
});

app.get('/', (req, res) => {
  res.send('invalid endpoint')
});

var Serialport = require('serialport');
const { error, log } = require('console');
var Readline = Serialport.parsers.Readline;
var serialport = `require('serialport')`;
var port2 = new Serialport('/dev/ttyUSB0', {
  baudRate: 9600
});
const parser = port2.pipe(new Readline({ delimiter: '\r\n' }))
//console.log(parser);


io.on('connection', (socket) => {

  parser.on("data", (data) => {
    console.log(data);
    io.emit("servo", data?.servoState)
    io.on('connection', () => {
      console.log('a user connected');
    });
    //let jsonData = JSON.parse(data)

    io.emit('temp', data);
    //io.emit('servo',jsonData.servoState);
    
    //console.log(jsonData.servoState);

    let tempy = data.split('/')
    let temperer = tempy[0]
    let humidy = tempy[1]


    const Data = temperer;
    //calcul de la date et l'heure 
    var data
    var datHeure = new Date();
    var min = datHeure.getMinutes();
    var heur = datHeure.getHours(); //heure
    var sec = datHeure.getSeconds(); //secondes
    var mois = datHeure.getDate(); //renvoie le chiffre du jour du mois 
    var numMois = datHeure.getMonth() + 1; //le mois en chiffre
    var laDate = datHeure.getFullYear(); // me renvoie en chiffre l'annee
    if (numMois < 10) { numMois = '0' + numMois; }
    if (mois < 10) { mois = '0' + mois; }
    if (sec < 10) { sec = '0' + sec; }
    if (min < 10) { min = '0' + min; }
    var heurei = heur + ':' + min + ':' + sec;
    var datei = mois + '-' + numMois + '-' + laDate;
    var temphum = { 'temperature': temperer, 'humidite': humidy, 'date': datei }
    if ((heur == '14' && min == '43' && sec == '00') || (heur == '08' && min == '29' && sec == '00')) {


      MongoClient.connect(url, { useUnifiedTopology: false }, function (err, db) {
        if (err) throw err;
        var dbo = db.db('Poulailler');
        dbo.collection('temphum').insertOne(temphum, (function (err, res) {
          if (err) throw err;
          console.log('Donnees inserées');
          db.close();
        }))
      })

    }



  });

  socket.on('ledOn', () => {
    port2.write("H")
    console.log('LED allumée');
  });

  socket.on('ledOff', () => {
    port2.write("L")
    console.log('LED éteinte');
  });

  socket.on('ChaufOn', () => {
    port2.write("1")
    console.log('Chauffage allumé');
  });

  socket.on('ChaufOff', () => {
    port2.write("0")
    console.log('Chauffage éteint');
  });

  socket.on('VentilOn', () => {
    port2.write("2")
    console.log('refroidisseur allumé');
  });

  socket.on('VentilOff', () => {
    port2.write("3")
    console.log('refroidisseur éteint');
  });

  socket.on('servoOne', () => {
    port2.write("4")
    console.log('servo éteint');
  });

  socket.on('servoOff', () => {
    port2.write("5")
    console.log('servo éteint');
  });

});
    
const datHeure = new Date();
const heur = datHeure.getHours(); // heure
async function fetchData() {
  try {
    const data = await heure.findOne({ _id: '6469311597350ae1a74d693e' }).exec();
    if (data && heur === parseInt(data.heure1)|| data && heur === parseInt(data.heure2) || data && heur === parseInt(data.heure3)) {
      console.log(heur);
      port2.write("4");
      setTimeout(()=>{
        port2.write("5");
      }, 10000)
      console.log("alimenter");
    }
  } catch (error) {
    console.log(error);
  }
}

fetchData();