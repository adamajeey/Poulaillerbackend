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
/**/





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


//température et humidité
/* */



 var Serialport = require('serialport');
 const { error } = require('console');
 var Readline = Serialport.parsers.Readline;
  var serialport=`require('serialport')`;
 var port2 = new Serialport('/dev/ttyUSB0', {
      baudRate: 9600
 });
  const parser = port2.pipe(new Readline({ delimiter: '\r\n' }))
//  console.log(parser);


  
parser.on("data", (data)=>{
  console.log(data);
     io.on('connection', () => {
    io.emit('temp',data)
    console.log('a user connected');
  });


    let tempy = data.split('/')
    let temperer = tempy[0]
    let humidy = tempy[1]
                     
});