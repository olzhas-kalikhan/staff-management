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



const fs = require("fs");

var employees=[];
var departments=[];
var arrayPromise=(array, msg )=>{
    return new Promise((resolve, reject)=>{
        array.length>0?resolve(array):reject(`No ${msg} returned`);
    })
}

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
    return arrayPromise(employees, `employees`);
}
module.exports.getManagers=()=>{
    var managers=employees.filter(x => x.isManager == true);
    return arrayPromise(managers, `managers`);
}
module.exports.getDepartments=()=>{
    return arrayPromise(departments, `managers`);
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
    return arrayPromise(employeeByStatus, `employees with status ${status}`);
}
module.exports.getEmployeesByDepartment=(department)=>{
    let empByDep = employees.filter(x=>x.department== department);
    return arrayPromise(empByDep, `employees with deparment number ${department}`);
}
module.exports.getEmployeesByManager=(managerNum)=>{
    let empByManager=employees.filter(x=>x.employeeManagerNum == managerNum);
    return arrayPromise(empByManager, `managers with managerNum ${managerNum}`);
}
module.exports.getEmployeeByNum=(num)=>{
    let empByNum=employees.filter(x=>x.employeeNum == num);
    
    return new Promise((resolve, reject)=>{
        empByNum.length>0 ?resolve(empByNum[0]):reject(`No employees with number ${num} returned`);
    })
}


module.exports.updateEmployee=(employeeData)=>{
    let emp = employees.find(e=>  e.employeeNum == employeeData.employeeNum);
    return new Promise((resolve, reject)=>{
        if(emp.employeeNum>0){
            employees[emp.employeeNum-1] = Object.assign({}, employeeData);
            resolve();
        }
    })
} 

