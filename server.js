/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work with the exception of the parts provided to me by my professor 
*  in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically
*  from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Olzhas Kalikhan Student ID: 102469186 Date: 10.10.2019
*
*  Online (Heroku) Link: https://guarded-forest-30038.herokuapp.com/
*
********************************************************************************/



var express = require("express");
var app = express();
var path = require("path");
var multer = require("multer");
var querystring = require("querystring");
var HTTP_PORT = process.env.PORT || 8080;
var dataService = require('./data-service')
const bodyParser = require('body-parser');
const fs = require('fs');
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename : function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
  
});
const upload = multer({storage : storage});
//on server Start output listenning port
function onHttpStart(){
    console.log("Express http server listening on "+HTTP_PORT);
}

handleResponse=(rs ,func)=>{
    func.then((result)=>rs.json(result))
    .catch((result)=>rs.json({message : result}));
}

dataService.initialize().then(()=>{
    
    app.listen(HTTP_PORT, onHttpStart);
     app.use(express.static('public')); 
     app.use(bodyParser.urlencoded({ extended: true }));
//send home page to the server
    app.get("/", (req,res)=>{
        res.sendFile(path.join(__dirname,"/views/home.html"));
    });
//send about page to the server 
    app.get("/about", (req,res)=>{
        res.sendFile(path.join(__dirname,"/views/about.html"));
    });
    app.get("/employees/add",(req,res)=>{
        res.sendFile(path.join(__dirname,"/views/addEmployee.html"))
    });
    
    app.get("/managers", (req, res)=>{
        handleResponse (res, dataService.getManagers());
    });
    app.get("/departments",(req,res)=>{
        handleResponse (res, dataService.getDepartments());
    });

    app.get("/images/add", (req,res)=>{
        res.sendFile(path.join(__dirname, "views/addImage.html"));
    });
    app.get("/images",(req,res)=>{
        fs.readdir("./public/images/uploaded", (err, items)=>{
            res.json({images : items});
        })
    });

    app.post("/images/add", upload.single("imageFile"), (req, res)=>{
        res.redirect("/images");
    });
   
    app.post("/employees/add",(req,res)=>{
        dataService.addEmployee(req.body).then(()=>{res.redirect("/employees")});
    })
    app.get("/employees", (req,res)=>{    
        if(req.query.status){
            handleResponse( res, dataService.getEmployeesByStatus(req.query.status));    
        }
        else if(req.query.department){    
            handleResponse( res, dataService.getEmployeesByDepartment(req.query.department));
        }   
        else if(req.query.manager){
            handleResponse( res, dataService.getEmployeesByManager(req.query.manager));
        }
        else{
            handleResponse( res, dataService.getAllEmployees());
        }        
    });
    app.get("/employees/:empNum", (req,res)=>{
        
        handleResponse( res , dataService.getEmployeeByNum(req.params.empNum));
    });
    
    
    app.get("*",(req,res)=>{
        res.status(404).send("<h1>Page not found</h1> <br> Status code: " + res.statusCode);
    })
})
.catch((reason)=>{
    console.log(reason);
})
