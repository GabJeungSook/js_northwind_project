const mysql = require('mysql2');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

db.connect((err) => {
    if (err) {
        console.log(err.message);
        // throw err;
    }
    console.log('Connected to database');
});


class DBServices {
    static getDBServiceInstance() {
        return instance ? instance : new DBServices();
    }

    async getAllCustomerIds() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT id FROM customers;";
                db.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            // console.log(response);
            return response;
        } catch (error)
        {
            console.log(error);
        }
    }

    async getCustomerData(id)
    {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT CONCAT(first_name, ' ', last_name) as 'name', company, city FROM customers WHERE id = ?;";
                db.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            return response;
        } catch (error)
        {
            console.log(error);
        }
    }

    async getCustomerOrders(id)
    {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT o.id, o.order_date, o.ship_address, o.ship_city FROM orders o JOIN customers c ON o.customer_id = c.id WHERE c.id = ?;";
                db.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            return response;
        } catch (error)
        {
            console.log(error);
        }
    }

    async getOrderProducts(id)
    {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT o.id as 'order_id', p.id, od.unit_price, od.quantity, od.discount FROM orders o "
                               +"JOIN order_details od ON od.order_id = o.id JOIN products p ON p.id = od.product_id WHERE o.id = ?;";
                db.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            return response;
        } catch (error)
        {
            console.log(error);
        }
    }

}

module.exports = DBServices;