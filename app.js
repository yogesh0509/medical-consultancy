const express = require('express');
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser')

const port = process.env.PORT || 3000
const projectRoutes = require("./api/routes/projectRoutes");

// const projectRoutes = require("./api/routes/projectRoutes");
// const dashboardRoutes = require("./client/routes/dashboardRoutes");
// const User = require("./api/routes/user_routes");

const uri = "mongodb://127.0.0.1:27017/local";
mongoose.connect(uri, { useNewUrlParser: true });
const db = mongoose.connection;
db.once('open', function () {
  console.log("Connected");
})

app.use('/static', express.static('./client/static'));
app.set('views', path.join(__dirname, './client/views'));
app.engine('html', require('ejs').renderFile);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/projectRoutes/", projectRoutes);

app.get("/", (req, res, next) => {
  res.render('index.html')
});

app.get("/signup", (req, res, next) => {
  res.render('signup.html')
});

app.get("/login", (req, res, next) => {
  res.render('login.html')
});

app.get("/get_started", (req, res) => {
  res.render('get_started.html')
})

app.get("/doubts", (req, res) => {
  res.render('doubts.html')
})

// app.use("/dashboard/", dashboardRoutes);
// app.use("/projectRoutes/", projectRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

app.listen(port, () => {
  console.log("The application started successfully");
})