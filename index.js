var express = require('express');
var mongoClient = require("mongodb").MongoClient;
var cors = require("cors");
require('dotenv').config();

// var conStr = "mongodb://127.0.0.1:27017";
var conStr = process.env.MONGO_URI
const PORT = process.env.PORT || 3300;

var app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000","https://mydevproject.store"], // your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.get("/get-users", (req,res)=>{
    mongoClient.connect(conStr).then(clientObj=>{
        var database = clientObj.db("calendardb");
        database.collection("users").find({}).toArray().then(documents=>{
            res.send(documents);
            res.end();
        });
    });
});

app.get("/get-appointments/:userid", (req,res)=>{
    mongoClient.connect(conStr).then(clientObj=>{
        var database = clientObj.db("calendardb");
        database.collection("appointments").find({UserId:req.params.userid})
        .toArray().then(documents=>{
            res.send(documents);
            res.end();
        });
    });
});

app.get("/appointments/:id", (req, res)=>{
    mongoClient.connect(conStr).then(clientObj=>{
        var database = clientObj.db('calendardb');
        database.collection("appointments").find({Appointment_Id:parseInt(req.params.id)})
        .toArray().then(documents=>{
            res.send(documents);
            res.end();
        })
    })
})

app.post("/register-user", (req,res)=>{
    mongoClient.connect(conStr).then(clientObj=>{
        var database = clientObj.db("calendardb");
        var user = {
            UserId: req.body.UserId,
            UserName: req.body.UserName,
            Password: req.body.Password,
            Email: req.body.Email,
            Mobile: req.body.Mobile
        };
        database.collection("users").insertOne(user).then(()=>{
            console.log("User Registered..");
            res.end();
        });
    });
});

app.post("/add-task", (req,res)=>{
    mongoClient.connect(conStr).then(clientObj=>{
        var database = clientObj.db("calendardb");
        var appointment = {
            Appointment_Id: parseInt(req.body.Appointment_Id),
            Title: req.body.Title,
            Description: req.body.Description,
            Date: new Date(req.body.Date),
            UserId: req.body.UserId
        };
        database.collection("appointments").insertOne(appointment).then(()=>{
            console.log("Task added succesfully")
        });
    });
});

app.put("/edit-task/:id", (req,res)=>{
    var id = parseInt(req.params.id);
    mongoClient.connect(conStr).then(clientObj=>{
        var database = clientObj.db("calendardb");
        var appointment = {
            Appointment_Id: parseInt(id),
            Title: req.body.Title,
            Description: req.body.Description,
            Date: new Date(req.body.Date),
            UserId: req.body.UserId
        };
        database.collection("appointments").updateOne({Appointment_Id:id},{$set:appointment})
        .then(()=>{
            console.log("Task Updated");
            res.end();
        })
    });
});

app.delete("/remove-task/:id",(req,res)=>{
    mongoClient.connect(conStr).then(clientObj=>{
        var database = clientObj.db("calendardb");

        database.collection("appointments").deleteOne({Appointment_Id:parseInt(req.params.id)})
        .then(()=>{
            console.log("Task Deleted..");
            res.end();
        });
    });
});

// app.listen(3300);
// console.log("Server started : http://127.0.0.1:3300");

app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
