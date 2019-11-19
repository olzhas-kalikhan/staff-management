/*********************************************************************************
*  WEB322 – Assignment 05
*  I declare that this assignment is my own work with the exception of the parts provided to me by my professor 
*  in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically
*  from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Olzhas Kalikhan Student ID: 102469186 Date: 15.11.2019
*
*  Online (Heroku) Link: https://infinite-waters-33512.herokuapp.com/
*
********************************************************************************/
var express = require("express");
var app = express();
var path = require("path");
var multer = require("multer");
var querystring = require("querystring");
var exphbs = require('express-handlebars');
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
//assignment 4 update
handleEmployees=(response, promise)=>{
    promise.then((result)=>{
        if(result.length>0)
            response.render("employees", { employees : result })
        else
            response.render("employees",{ message:"no results returned" })
    })
    .catch(()=>res.status(500).send("Employee not Found"));
           
}

dataService.initialize().then(()=>{
    app.use(express.static('public')); 
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(function(req,res,next){
        let route = req.baseUrl + req.path;
        app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
        next();
    });
    
    app.engine('.hbs', exphbs({ extname: '.hbs',
                                defaultLayout: 'main',
                                helpers: 
                                    { navLink: function(url, options){
                                        return '<li' + 
                                            ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                                            '><a href="' + url + '">' + options.fn(this) + '</a></li>';
                                    },
                                    equal: function (lvalue, rvalue, options) {
                                        if (arguments.length < 3)
                                            throw new Error("Handlebars Helper equal needs 2 parameters");
                                        if (lvalue != rvalue) {
                                            return options.inverse(this);
                                        } else {
                                            return options.fn(this);
                                        }
                                    }
                                }
                                
    }));
    app.set("view engine", ".hbs");
    app.listen(HTTP_PORT, onHttpStart);
    
    app.get("/", (req,res)=>{
        res.render('home');
    });
    app.get("/about", (req,res)=>{
        res.render('about');
    });    
    
    app.get("/departments",(req,res)=>{
        dataService.getDepartments().then((result)=>{
            if(result.length>0)
                res.render("departments",{ departments : result});
            else    
                res.render("departments", {message:"no results returned"});
        })
    });
    app.get("/images/add", (req,res)=>{
        res.render('addImage');
    });
    app.get("/images",(req,res)=>{
        //save the list of filenames in folder uploaded to array items 
        fs.readdir("./public/images/uploaded", (err, items)=>{
            res.render('images', {
                data: items
            });
        })
    });
    app.post("/images/add", upload.single("imageFile"), (req, res)=>{ //upload image on post request
        res.redirect("/images");//redirect to images route on response
    });
    app.get("/employees/add",(req,res)=>{
        dataService.getDepartments().then((result)=>res.render('addEmployee', {departments: result}))
                                    .catch(()=>res.render('addEmployee',{departments: []}));
        
    });
    app.post("/employees/add",(req,res)=>{
        dataService.addEmployee(req.body).then(()=>res.redirect("/employees"))
                                         .catch(()=>res.status(500).send("Unable to Add Employee"));
      
    })
    //assignment 4 update
    app.post("/employee/update", (req, res) => {
        dataService.updateEmployee(req.body).then(res.redirect("/employees"))
                                            .catch(()=>res.status(500).send("Unable to Add Employee"));
    });
    
    app.get("/employees", (req,res)=>{    
        if(req.query.status){
            handleEmployees( res, dataService.getEmployeesByStatus(req.query.status));//==>line 40  
        }
        else if(req.query.department){    
            handleEmployees( res, dataService.getEmployeesByDepartment(req.query.department));//==>line 40
        }   
        else if(req.query.manager){
            handleEmployees( res, dataService.getEmployeesByManager(req.query.manager));//==>line 40
        }
        else{
            handleEmployees( res, dataService.getAllEmployees());//line 40
        }        
    });
    //assignment 4 update
    app.get("/employee/:empNum", (req, res) => {

        // initialize an empty object to store the values
        let viewData = {};
    
        dataService.getEmployeeByNum(req.params.empNum).then((data) => {
            if (data) {
                viewData.employee = data; //store employee data in the "viewData" object as "employee"
            } else {
                viewData.employee = null; // set employee to null if none were returned
            }
        }).catch(() => {
            viewData.employee = null; // set employee to null if there was an error 
        }).then(dataService.getDepartments)
        .then((data) => {
            viewData.departments = data; // store department data in the "viewData" object as "departments"
    
            // loop through viewData.departments and once we have found the departmentId that matches
            // the employee's "department" value, add a "selected" property to the matching 
            // viewData.departments object
    
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.employee.department) {
                    viewData.departments[i].selected = true;
                }
            }
    
        }).catch(() => {
            viewData.departments = []; // set departments to empty if there was an error
        }).then(() => {
            if (viewData.employee == null) { // if no employee - return an error
                res.status(404).send("Employee Not Found");
            } else {
                res.render("employee", { viewData: viewData }); // render the "employee" view
            }
        });
    });
    
    app.get("/departments/add",(req, res)=>{
        res.render('addDepartment');
    })
    app.post("/departments/add", (req, res)=>{
        dataService.addDepartment(req.body).then(()=>{ res.redirect("/departments")})
                                           .catch(()=>res.status(500).send("Unable to Add Employee"));
    })
    app.post("/department/update", (req,res)=>{
        dataService.updateDepartment(req.body).then(()=>{res.redirect("/departments")})
                                              .catch(()=>res.status(500).send("Unable to Add Employee"));
    })
    app.get("/department/:departmentId", (req, res)=>{
        dataService.getDepartmentById(req.params.departmentId).then((result)=>res.render('department', { department : result }))
                                                              .catch(()=>res.status(404).send("Department Not Found")); 
    })
    app.get("/departments/delete/:departmentId", (req,res)=>{
        dataService.deleteDepartmentById(req.params.departmentId).then(()=>{res.redirect("/departments")})
                                                                 .catch(()=>res.status(500).send("Unable to Remove Department / Department not found)"  ))
    })
    app.get("/employees/delete/:empNum", (req,res)=>{
        dataService.deleteEmployeeByNum(req.params.empNum).then(()=>res.redirect("/employees"))
                                                          .catch(()=>res.status(500).send("Unable to Remove Employee / Employee not found)"))
    })
    app.get("*",(req,res)=>{
        res.status(404).send("<h1>Page not found</h1> <br> Status code: " + res.statusCode);
    })
})
.catch((reason)=>{
    console.log(reason);
})