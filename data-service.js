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



const fs = require("fs");

let employees=[];
let departments=[];

module.exports.initialize=()=>{
    
    return new Promise((resolve, reject)=>{
        
        fs.readFile('./data/employees.json', 'utf8', (err, dataEmp) =>	 {
            if (err) reject("unable to read file");
            else{
                employees=JSON.parse(dataEmp);
                fs.readFile('./data/departments.json', 'utf8', (err, dataDep) =>{
                    if (err) reject("unable to read file");
                    else{
                        departments=JSON.parse(dataDep);     
                        resolve();
                    }              
                });
            
            }                                     
        })
        
    })        

        
}
module.exports.getAllEmployees=()=>{
    
   return new Promise((resolve, reject)=>{
       if (employees.length>0){         
           resolve(employees);
       }else{
           reject("no return values");
       }
   })
}
module.exports.getManagers=()=>{
    
    var managers=employees.filter(x => x.isManager == true);
    return new Promise((resolve, reject)=>{
        if(managers.length>0){
            resolve(managers);
        }else{
            reject("no managers returned");
        }
    })
}
module.exports.getDepartments=()=>{
    return new Promise((resolve, reject)=>{
        if(departments.length>0){
            resolve(departments);
        }else{
            reject("no return values");
        }
    })
}
module.exports.addEmployee=(employeeData)=>{
    return new Promise((resolve, reject)=>{
        employeeData.employeeNum=employees.length+1; 
        if(employeeData.isManager == undefined){
            employeeData.isManager=false;
        }
           
        employees.push(employeeData);
        resolve();
    })
}
module.exports.getEmployeesByStatus=(status)=>{
    let employeeByStatus=employees.filter(x=>x.status == status);
    return new Promise((resolve,reject)=>{
        if(employeeByStatus.length<=0){
            reject("No employees with requested status");
        }
        else{
            resolve(employeeByStatus);
        }
    })    
}
module.exports.getEmployeesByDepartment=(department)=>{
    let empByDep = employees.filter(x=>x.department== department);
    return new Promise((resolve, reject)=>{
        if(empByDep.length<=0){
            reject("No employees with requested department");
        }
        else{
            resolve(empByDep);
        }
    })
}
module.exports.getEmployeesByManager=(managerNum)=>{
    let empByManager=employees.filter(x=>x.employeeManagerNum == managerNum);
    return new Promise((resolve, reject)=>{
        if(empByManager.length<=0){
            reject("No employees with requested manager number");
        }
        else{
            resolve(empByManager);
        }
    })
}
module.exports.getEmployeeByNum=(num)=>{
    let empByNum=employees.filter(x=>x.employeeNum == num);
    return new Promise((resolve, reject)=>{
        if(empByNum.length<=0){
            reject("No employees with requested number");
        }
        else{
            resolve(empByNum);
        }
    })
}

