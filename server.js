const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const createError = require('http-errors');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const temper = require('./model/temphum');

// Here we will avoid Mongoose warning (strictQuery will be 'false')
mongoose.set('strictQuery', true);

// Here we are connecting to the MongoDB database using mongoose
mongoose
  .connect('mongodb+srv://Adama:gahdamns@cluster0.9gldina.mongodb.net/Poulailler?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Here we are adding the constant 'app' using express

// Here we are managing body requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Here we are managing CORS security
app.use(cors({ origin: '*' }));

// Here we are managing the endpoint for access to the user model
const userRoute = require('./routes/route');
app.use('/api', userRoute);

// Here we are managing the server's port (using the one provided by the system or 3000)
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log('Port connected to: ' + port);
});

// Initialization of Socket.IO
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['PUT', 'GET', 'POST', 'DELETE', 'OPTIONS'],
    credentials: false
  }
});

// This middleware catches errors when the URL for the endpoint is not correct and sends them to the next
app.use((req, res, next) => {
  next((404));
});

app.get('/', (req, res) => {
  res.send('Invalid endpoint');
});

app.use((err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});

const Serialport = require('serialport');
const Readline = Serialport.parsers.Readline;
const port2 = new Serialport('/dev/ttyUSB0', {
  baudRate: 9600
});
const parser = port2.pipe(new Readline({ delimiter: '\r\n' }));
// Allumage lampe
io.on('connection', (socket) => {
    parser.on('data', (data) => {
        io.emit('temp', data);
        let tempy = data.split('/');
        let temperer = tempy[0];
        let humidy = tempy[1];
        let waterLevel = tempy[0];
        console.log('Temperature:', temperer);
        console.log('Humidity:', humidy);
        console.log('Water Level:', waterLevel);
      
    const newData = new temper({
      temperature8h: temperer,
      humidite8h: humidy,
      temperature12h: '00',
      humidite12h: '00',
      temperature18h: '00',
      humidite18h: '00',
      temperatureM: temperer,
      humiditeM: humidy,
      date: '',
      heure: ''
    });

    // Calcul de la date et de l'heure
    const datHeure = new Date();
    const min = datHeure.getMinutes();
    const heur = datHeure.getHours(); // Heure
    const sec = datHeure.getSeconds(); // Secondes
    const mois = datHeure.getDate(); // Renvoie le chiffre du jour du mois
    const numMois = datHeure.getMonth() + 1; // Mois en chiffre
    const laDate = datHeure.getFullYear(); // Année en chiffre
    const heurei = heur + ':' + min + ':' + sec;
    const datei = mois + '/' + numMois + '/' + laDate;

    if (heur === 8 && min === 10 && sec === 0) {
      console.log('IL EST 8H');

      newData.date = datei;
      newData.heure = heurei;

      newData.save((err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Les données de 8H sont insérées');
          io.emit('Heure', true);
        }
      });
    }

    if (heur === 8 && min === 29 && sec === 0) {
      console.log('IL EST 12H');

      temper.findOne({ date: datei }, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          const temperatureSomme1 = parseFloat(data.temperature8h) + parseFloat(temperer);
          const temperatureM1 = temperatureSomme1 / 2;
          const humiditeSomme1 = parseFloat(data.humidite8h) + parseFloat(humidy);
          const humiditeM1 = humiditeSomme1 / 2;

          temper.updateOne(
            { date: datei },
            { $set: { temperature12h: temperer, humidite12h: humidy, temperatureM: temperatureM1, humiditeM: humiditeM1 } },
            (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log('Les données de 12H sont insérées');
                console.log('Les données moyennes sont insérées');
                io.emit('Heure', true);
              }
            }
          );
        }
      });
    }

    if (heur === 8 && min === 30 && sec === 0) {
      console.log('IL EST 18H');

      temper.findOne({ date: datei }, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          const temperatureSomme2 = parseFloat(data.temperature8h) + parseFloat(data.temperature12h) + parseFloat(temperer);
          const temperatureM2 = temperatureSomme2 / 3;
          const humiditeSomme2 = parseFloat(data.humidite8h) + parseFloat(data.humidite12h) + parseFloat(humidy);
          const humiditeM2 = humiditeSomme2 / 3;

          temper.updateOne(
            { date: datei },
            { $set: { temperature18h: temperer, humidite18h: humidy, temperatureM: temperatureM2, humiditeM: humiditeM2 } },
            (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log('Les données de 18H sont insérées');
                console.log('Les données moyennes sont insérées');
                io.emit('Heure', true);
              }
            }
          );
        }
      });
    }
  });

  socket.on('ledOn', () => {
    port2.write('H');
    console.log('LED allumée');
  });

  socket.on('ledOff', () => {
    port2.write('L');
    console.log('LED éteinte');
  });

  socket.on('ChaufOn', () => {
    port2.write('1');
    console.log('Chauffage allumé');
  });

  socket.on('ChaufOff', () => {
    port2.write('0');
    console.log('Chauffage éteint');
  });

  socket.on('VentilOn', () => {
    port2.write('2');
    console.log('Refroidisseur allumé');
  });

  socket.on('VentilOff', () => {
    port2.write('3');
    console.log('Refroidisseur éteint');
  });
 
});

