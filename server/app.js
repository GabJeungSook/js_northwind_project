const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const db = require('./db-connect');
const DBServices = require('./db-connect');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//read
app.get('/getIds', (request, response) => {
    const db = DBServices.getDBServiceInstance();

    const result = db.getAllCustomerIds();
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});
//get data
app.get('/getCustomer/:id', (request, response) => {
    const {id} = request.params;
    const db = DBServices.getDBServiceInstance();
    const result = db.getCustomerData(id);
    
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});
//get orders
app.get('/getOrders/:id', (request, response) => {
    const {id} = request.params;
    const db = DBServices.getDBServiceInstance();
    const result = db.getCustomerOrders(id);
    
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

//get products
app.get('/getProducts/:id', (request, response) => {
    const {id} = request.params;
    const db = DBServices.getDBServiceInstance();
    const result = db.getOrderProducts(id);
    
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));