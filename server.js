/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work with the exception of the parts provided to me by my professor 
*  in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically
*  from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Olzhas Kalikhan Student ID: 102469186 Date: 11.10.2019
*
*  Online (Heroku) Link: https://infinite-waters-33512.herokuapp.com/
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
//process response from a promise
//function is used for similar promises
handleResponse=(response ,promise)=>{
    promise.then((result)=>response.json(result))
    .catch((result)=>response.json({message : result}));
}

dataService.initialize().then(()=>{
    app.use(express.static('public')); 
    app.use(bodyParser.urlencoded({ extended: true }));
    app.listen(HTTP_PORT, onHttpStart);
    app.get("/", (req,res)=>{
        res.sendFile(path.join(__dirname,"/views/home.html"));//send home page 
    });
    app.get("/about", (req,res)=>{
        res.sendFile(path.join(__dirname,"/views/about.html"));//send about page
    });    
    app.get("/employees/add",(req,res)=>{
        res.sendFile(path.join(__dirname,"/views/addEmployee.html"))//send addEmployee page
    });
    app.get("/managers", (req, res)=>{
        handleResponse (res, dataService.getManagers());//==>line 35
    });
    app.get("/departments",(req,res)=>{
        handleResponse (res, dataService.getDepartments());//==>line 35
    });
    app.get("/images/add", (req,res)=>{
        res.sendFile(path.join(__dirname, "views/addImage.html"));//send addImage page
    });
    app.get("/images",(req,res)=>{
        //save the list of filenames in folder uploaded to array items 
        fs.readdir("./public/images/uploaded", (err, items)=>{
            res.json({images : items});
        })
    });
    app.post("/images/add", upload.single("imageFile"), (req, res)=>{ //upload image on post request
        res.redirect("/images");//redirect to images route on response
    });
    app.post("/employees/add",(req,res)=>{
        dataService.addEmployee(req.body).then(()=>{res.redirect("/employees")});
    })
    app.get("/employees", (req,res)=>{    
        if(req.query.status){
            handleResponse( res, dataService.getEmployeesByStatus(req.query.status));//==>line 35    
        }
        else if(req.query.department){    
            handleResponse( res, dataService.getEmployeesByDepartment(req.query.department));//==>line 35
        }   
        else if(req.query.manager){
            handleResponse( res, dataService.getEmployeesByManager(req.query.manager));//==>line 35
        }
        else{
            handleResponse( res, dataService.getAllEmployees());//==>line 35
        }        
    });
    app.get("/employees/:empNum", (req,res)=>{  
        handleResponse( res , dataService.getEmployeeByNum(req.params.empNum));//==>line 35
    });
    app.get("*",(req,res)=>{
        res.status(404).send("<h1>Page not found</h1> <br> Status code: " + res.statusCode);
    })
})
.catch((reason)=>{
    console.log(reason);
})