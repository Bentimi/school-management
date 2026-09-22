const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan  = require("morgan");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const { responseHandler } = require("./middleware/responseHandler.middleware");
const { errorHandler } = require("./middleware/errorHandler.middleware");
const UserRoutes = require("./routes/user.routes");
const SessionRoutes = require("./routes/session.routes");


const passport = require("passport");
const cookieParser = require("cookie-parser"); 
const text = require("./test");

const app = express();

require("dotenv").config();


app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json())

// Middlewares
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'http://localhost:5174', 
        'http://localhost:5175'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token']
}));

app.use(passport.initialize());


// app.use(responseHandler);

// Swagger Definition
const swaggerOptions = {
       swaggerDefinition: {
           openapi: '3.0.0',
           info: {
               title: 'My API',
               version: '1.0.0',
               description: 'REST API documentation for School Management System',
           },
           servers: [
               {
                   url: `http://localhost:${process.env.PORT}`,
               },
           ],
      components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT', 
            },
        },
    },
       },
       apis: ['server.js' ,'./routes/*.js'], // Path to your API docs
   };

   const swaggerDocs = swaggerJSDoc(swaggerOptions);
   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

   app.get('/', (req, res) => {
        res.send("Hello word, welcome to School Management System")
   })

   app.use(responseHandler)
   
   app.use("/account", UserRoutes);
   app.use("/session", SessionRoutes);

   app.use(errorHandler)


//    text()

   module.exports =  app;