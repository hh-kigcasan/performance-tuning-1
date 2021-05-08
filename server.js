let express = require("express");
let session = require('express-session');
let bodyParser = require('body-parser');

let app = express();
app.use(express.static(__dirname + "/assets"));
app.set('views', __dirname + '/application/views'); 
app.set('view engine', 'ejs');
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.cookieParser());


//config property
app.locals.enable_profiler=true;

//middleware
const middleware = require(`./system/middleware`);
app.use(middleware.load);

//load all routes
const main_routes = require(`./application/config/main.routes.js`);
app.use(main_routes);


//listen
app.listen(1143, function() {
  console.log("listening on port 1143");
})
