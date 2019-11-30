/*********************************************************************************
* WEB322 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part of this
* assignment has been copied manually or electronically from any other source (including web sites) or
* distributed to other students.
*
* Name: Olzhas Kalikhan Student ID: 102469186 Date: 29/11/2019
*
* Online (Heroku) Link: https://infinite-waters-33512.herokuapp.com/
*
********************************************************************************/



const Sequelize = require('sequelize');
var sequelize = new Sequelize('dbekqhmdjnh5lm', 'aurfisfykqgknl', 'fa8bc04a18644b408721d564bdb32bbfb3b40ceda20693722844ac544a187a38', {
    host: 'ec2-54-83-33-14.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});



var Employee = sequelize.define('Employee', {
    employeeNum :	{
                        type: Sequelize.INTEGER,
                        primaryKey : true,
                        autoIncrement : true
                    },
    firstName           : Sequelize.STRING,
    lastName            : Sequelize.STRING,
    email               : Sequelize.STRING,
    SSN                 : Sequelize.STRING,
    addressStreet       : Sequelize.STRING,
    addressCity         : Sequelize.STRING,
    addressState        : Sequelize.STRING,
    addressPostal       : Sequelize.STRING,
    maritalStatus       : Sequelize.STRING,
    isManager           : Sequelize.BOOLEAN,
    employeeManagerNum  : Sequelize.INTEGER,
    status              : Sequelize.STRING,
    hireDate            : Sequelize.STRING

});
var Deparment = sequelize.define('Department',{
    departmentId:   {
                     type: Sequelize.INTEGER,
                     primaryKey : true,
                     autoIncrement: true
                    },
    departmentName: Sequelize.STRING
})
Deparment.hasMany(Employee,{foreignKey: 'department'});

module.exports.initialize=()=>{
    
    return new Promise((resolve, reject)=>{
        sequelize.sync()
        .then(()=>{
            resolve("Synchronized");
        })
        .catch(()=>{
            reject("Unable to sync the database");
        })
        
    })        
}
module.exports.getAllEmployees=()=>{
    return new Promise((resolve, reject)=>{
        Employee.findAll().then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            reject("No results returned");
        });
    })
}

module.exports.getDepartments=()=>{
    return new Promise((resolve, reject)=>{
        Deparment.findAll().then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            reject("No results returned");
        });        
    })
}
module.exports.addEmployee=(emp)=>{
    return new Promise((resolve, reject)=>{ 
        emp.isManager = (emp.isManager)? false : true;
        Object.keys(emp).forEach(e => {
            if(emp[e]=="" || emp[e]==undefined){
                emp[e] = null;
            }
        });
        //if(emp.employeeManagerNum == '')
        //    emp.employeeManagerNum = null; 
        console.log(emp);
        
        
        
        Employee.create({
            firstName           : emp.firstName,
            lastName            : emp.lastName,
            email               : emp.email,
            SSN                 : emp.SSN,
            addressStreet       : emp.addressStreet,
            addressCity         : emp.addressCity,
            addressState        : emp.addressState,
            addressPostal       : emp.addressPostal,
            maritalStatus       : emp.maritalStatus,
            isManager           : emp.isManager,
            employeeManagerNum  : emp.employeeManagerNum,
            status              : emp.status,
            department           : emp.department,
            hireDate            : emp.hireDate
        }).then(()=>{
            resolve("success");
        })
        .catch(()=>{
            reject("unable to add employee");
        });
    })
}
module.exports.getEmployeesByStatus=(status)=>{
    return new Promise((resolve, reject)=>{
        Employee.findAll({
            where : { status : status }
        })
        .then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            resolve("no results return");
        });
    });
}
module.exports.getEmployeesByDepartment=(department)=>{
    return new Promise((resolve, reject)=>{
        Employee.findAll({
            where : { department : department }
        })
        .then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            resolve("no results return");
        });        
    });
}
module.exports.getEmployeesByManager=(managerNum)=>{
    return new Promise((resolve, reject)=>{
        Employee.findAll({
            where : { employeeManagerNum : managerNum }
        })
        .then((data)=>{
            resolve(data);
        })
        .catch(()=>{
            resolve("no results return");
        });
    })
}
module.exports.getEmployeeByNum=(num)=>{
    return new Promise((resolve, reject)=>{
        Employee.findAll({
            where : { employeeNum : num }
        })
        .then((data)=>{
            resolve(data[0]);
        })
        .catch(()=>{
            resolve("no results return");
        });
    })
}


module.exports.updateEmployee=(emp)=>{
    return new Promise((resolve, reject)=>{
        emp.isManager== emp.isManager? true : false;
        Object.keys(emp).forEach(e => {
            if(emp[e]=="" || emp[e]==undefined){
                emp[e] = null;
            }
        });
        Employee.update({
            firstName           : emp.firstName,
            lastName            : emp.lastName,
            email               : emp.email,
            SSN                 : emp.SSN,
            addressStreet       : emp.addressStreet,
            addressCity         : emp.addressCity,
            addressState        : emp.addressState,
            addressPostal       : emp.addressPostal,
            maritalStatus       : emp.maritalStatus,
            isManager           : emp.isManager,
            employeeManagerNum  : emp.employeeManagerNum,
            status              : emp.status,
            department          : emp.department,
            hireDate            : emp.hireDate
        },{
            where: { employeeNum : emp.employeeNum }
        })
        .then(()=>{
            resolve();
        })
        .catch(()=>{
            reject("unable to update employee");
        })
    })
    
} 

module.exports.addDepartment=(departmentData)=>{
    console.log(departmentData);
    return new Promise((resolve, reject)=>{
        Object.keys(departmentData).forEach(e => {
            if(departmentData[e]=="" || departmentData[e]==undefined){
                departmentData[e] = null;
            }
        });    
        Deparment.create({
            departmentId: departmentData.departmentId,
            departmentName: departmentData.departmentName
        })
        .then(()=>{
            resolve();
        })
        .catch(()=>{
            reject("unable to create department");
        })
    })
    
}

module.exports.updateDepartment=(departmentData)=>{
    return new Promise((resolve, reject)=>{
        Object.keys(departmentData).forEach(e => {
            if(departmentData[e]=="" || departmentData[e]==undefined){
                departmentData[e] = null;
            }
        });  
        Deparment.update({
            departmentName: departmentData.departmentName
        },{
            where: {departmentId : departmentData.departmentId }
        })
        .then(()=>{
            resolve();
        })
        .catch(()=>{
            reject("unable to update department");
        })
    })
    
}
module.exports.getDepartmentById=(id)=>{
    return new Promise((resolve, reject)=>{
        Deparment.findAll({
            where : { departmentId : id }
        })
        .then((data)=>{
            resolve(data[0]);
        })
        .catch(()=>{
            resolve("no results return");
        });    
    })
}
module.exports.deleteDepartmentById=(id)=>{
    return new Promise((resolve, reject)=>{
        Deparment.destroy({
            where : { departmentId : id }
        })
        .then(()=>{
            resolve();
        })
        .catch(()=>{
            reject();
        })
    })
}
module.exports.deleteEmployeeByNum=(empNum)=>{
    return new Promise((resolve,reject)=>{
        Employee.destroy({
            where: {employeeNum : empNum}
        })
        .then(()=>{
            resolve();
        })
        .catch(()=>{
            reject();
        })
    })
}