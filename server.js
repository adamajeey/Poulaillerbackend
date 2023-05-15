express = require('express');
path = require ('path');
mongoose = require('mongoose');
createError = require('http-errors')
cors = require('cors');
bodyParser =require('body-parser');
const app = express();
require('dotenv').config();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const temper = require('./model/temphum');


//Here we will avoid Mongoose warming (strictQuery will be 'false')
mongoose.set('strictQuery', true);

//Here we are connecting to data base mongoDb by mongoose
mongoose.connect('mongodb+srv://Adama:gahdamns@cluster0.9gldina.mongodb.net/Poulailler?retryWrites=true&w=majority',
//mongoose.connect( "mongodb+srv://papa:2605@cluster0.wepa2rr.mongodb.net/homestead?retryWrites=true&w=majority", 
{useNewUrlParser: true,
useUnifiedTopology: true})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échoué !'));

//Here are adding the constant 'app' using express


//Here are managing body requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
extended: false
}));
//Here are managing CORS sécurity
app.use(cors({origin: "*"}));


//Here we are managing endpoint for access to user model
const userRoute = require('./routes/route');
app.use('/api',userRoute);

//Here we are managing server's port (using which are giving by the system or 3000)
const port = process.env.PORT || 3000;
// const port = 8000;
 server.listen(port,() => {
    console.log('Port connected to: ' + port)
});

//initialisation socket
/* var io = require("socket.io")(server); */
io = require('socket.io')(server, 
    {     cors: 
        {origin: "*",
        methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
        credentials: false     }   
    });

//this middelware catch errors when the URL for endpoint is not correct and send them to the next
app.use((req,res,next) =>{
    next( (404))
});

app.get('/',(req,res) => {
    res.send('invalid endpoint')
});

app.use((err,req,res,next) =>{
    if (!err.statusCode) ErrorEvent.statusCode = 500;
    res.status(err.statutsCode).send(err.message);
});


 var Serialport = require('serialport');
 const { error } = require('console');
 var Readline = Serialport.parsers.Readline;
  var serialport=`require('serialport')`;
 var port2 = new Serialport('/dev/ttyUSB0', {
      baudRate: 9600
 });
  const parser = port2.pipe(new Readline({ delimiter: '\r\n' }))
//  console.log(parser);

//allumage lampe
io.on('connection', (socket)=>{

  parser.on("data", (data)=>{
    console.log(data);
       io.on('connection', () => {
      console.log('a user connected');
    });

    
    io.emit('temp', data);
  
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
      var datei = mois + '/' + numMois + '/' + laDate;

      if (heur == '15' && min == '10' && sec == '00') {
        console.log('IL EST 8H');


        //l'objet qui contient la temperature, humidite et la date +l'insertion de la temperature et de l'humidite à 8h
        var temphum = ('data', {
            temperature8h: temperer,
            humidite8h: humidy,
            temperature12h: 00,
            humidite12h: 00,
            temperature18h: 00,
            humidite18h: 00,
            temperatureM: temperer,
            humiditeM: humidy,
            date: datei,
            heure: heurei
        });

        const newData = new Data(temphum);
        newData.save((err) => {
            if (err) {
                console.log(err)
            } else {
                console.log('les données de 8H sont inserées');

                io.emit('Heure', true);
            }
        });
    }

    if (heur == '08' && min == '29' && sec == '00') {
      console.log('IL EST 12H');
      Data.findOne({ date: datei }, (err, data) => {
          if (err) {
              console.log(err);
          } else {
              temperatureSomme1 = (data.temperature8h + parseFloat(temperer));
              temperatureM1 = temperatureSomme1 / 2
              humiditeSomme1 = (data.humidite8h + parseFloat(humidy));
              humiditeM1 = humiditeSomme1 / 2
              Data.updateOne({ date: datei }, { $set: { temperature12h: temperer, humidite12h: humidy, temperatureM: temperatureM1, humiditeM: humiditeM1, } }, (err, data) => {
                  if (err) {
                      console.log(err);
                  } else {


                      console.log('les données de 12H sont inserées')

                      console.log('les données moyennes sont inserées')
                      io.emit('Heure', true);

                  }
              });
          }
      });

  }

  if (heur == '08' && min == '30' && sec == '00') {
    console.log('IL EST 18H');
    Data.findOne({ date: datei }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            temperatureSomme2 = (data.temperature8h + data.temperature12h + parseFloat(temperer));
            temperatureM2 = temperatureSomme2 / 3
            humiditeSomme2 = (data.humidite8h + data.humidite8h + parseFloat(humidy));
            humiditeM2 = humiditeSomme2 / 3
            Data.updateOne({ date: datei }, { $set: { temperature18h: temperer, humidite18h: humidy, tempereratureM: temperatureM2, humiditeM: humiditeM2, } }, (err, data) => {
                if (err) {
                    console.log(err);
                } else {


                    console.log('les données de 18H sont inserées')
                    console.log('les données moyennes sont inserées')
                    io.emit('Heure', true);

                }
            });

        }
    });

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

 

});

  

