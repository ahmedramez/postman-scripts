const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const moment = require('moment');
const uuid = require('uuid/v1');

let filePaths = {
    company: './company.json',
    employee: './emplyee.json',
    skills: './skills.json'

};

let app = express();
app.use(bodyParser.json());


app.get('/companies', function (req, res) {
    getData(filePaths.company, res, req);
});

app.get('/employees', function (req, res) {
    getData(filePaths.employee, res, req);
});

app.get('/skills/:employeeId', function (req, res) {
    let employeesData = [];
    let employee = {};
    try {
        employeesData = fs.readFileSync(filePaths.employee);
        employee = employeesData.map((emp) => emp.id == req.params.employeeId);
    }
    catch (error) { }
    res.json(employee.skills);
    // getData(filePaths.employee, res);
})

app.post('/company', function (req, res) {
    let companyItem = postData(filePaths.company, res, req);
    res.json({ companyId: companyItem.id, createdAt: moment(new Date()).format('DD.MM.YYYY') });

});

app.post('/employee', function (req, res) {
    if (!req.body.companyId) {
        res.status(400);
        res.json({ error: 'companyId is not exist' });
    }
    else {
        req.body.skills = [];
        let employeeItem = postData(filePaths.employee, res, req);
        res.json({ empId: employeeItem.id, createdAt: moment(new Date()).format('DD.MM.YYYY') });
    }
});

// app.post('/employee', function (req, res) {
//     postData(filePaths.employee, res, req);
// });



app.post('/skills/:employeeId', function (req, res) {
    let employeesData = [];
    let employee = {};
    try {
        employeesData = JSON.parse(fs.readFileSync(filePaths.employee));
        // employee = employeesData.find((emp) => function () {
        //     var x = req.params.employeeId;
        //     return parseInt(emp.id) === parseInt(req.params.employeeId);
        // });

        for (var i = 0; i < employeesData.length; i++) {
            if (parseInt(employeesData[i].id) === parseInt(req.params.employeeId)) {
                employee = employeesData[i];
            }
        }
    }
    catch (error) { }

    let companyItem = req.body;
    companyItem.id = parseInt(Math.ceil(Math.random() * 1000));
    let skillExist = false;
    if (employee.skills.length > 0) {
        if (employee.skills.find(e => e.name == req.body.name)) {
            skillExist = true;
        } else {
            employee.skills.push({ name: companyItem.name });
        }
    }
    else {
        employee.skills = [{ name: companyItem.name }];
    }

    //set the skills for the current user
    for (var i = 0; i < employeesData.length; i++) {
        if (employeesData[i].id == employee.id) {
            employeesData[i] = employee;
        }
    }

    fs.writeFileSync(filePaths.employee, JSON.stringify(employeesData));
    if (skillExist) {
        res.json({ skillExist: true });
    } else {
        res.json({ companyId: companyItem.id, createdAt: moment(new Date()).format('DD.MM.YYYY') });
    }
});





function postData(_filePath, res, req) {
    let companyData = [];
    try {
        companyData = JSON.parse(fs.readFileSync(_filePath)) ? JSON.parse(fs.readFileSync(_filePath)) : [];
    }
    catch (error) { }

    let companyItem = req.body;
    companyItem.id = String(parseInt(Math.ceil(Math.random() * 1000)));
    companyData.push(companyItem);

    fs.writeFileSync(_filePath, JSON.stringify(companyData));
    return companyItem;
}

function getData(filePath, res) {
    res.json(JSON.parse(fs.readFileSync(filePath)));
}


app.listen(3000, () => console.log("Server is Running on Port 3000"));