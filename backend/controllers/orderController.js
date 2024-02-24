// const { Query } = require("pg");
const { pool } = require("../models/db");

const createNewOrder = (req, res) => {

  const { order_price, eventDate, event_name, place, status } = req.body;
  const user_id = req.token.userId;

  const data = [order_price, user_id, eventDate,event_name, place, status];

  const { order_price, event_name,eventDate,place, status } = req.body;
  const user_id = req.token.userId;

  const data = [order_price, user_id,event_name, eventDate, place, status];


  pool
    .query(
      `INSERT INTO orders (order_price, user_id, event_name ,eventDate, place,status) VALUES ($1,$2,$3,$4,$5,$6) 
    RETURNING * `,
      data
    )
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "your plan is created successfully",
        result: result.rows,
      });
    })
    .catch((err) => {
      res.status(200).json({
        success: false,
        err: err,
        message: "server error",
      });
    });
};

const createNewOrderServices = (req, res) => {
  const order_id = req.params.id;
 const{service_package_id,service_ids} = req.body; // array

  let service;
   service_ids?service=service_ids:service=null
  console.log(service_ids,service);
   const data2= service_package_id
    
    let query
   
  if(service!=null){
    console.log(req.body)
    const data1= service.map((service_id) => `(${order_id}, ${service_id})`).join(', ');
    query=`
    INSERT INTO orders_services (order_id, service_id) 
    VALUES ${data1}
    RETURNING *`;
    
  }
  else{
    query=`INSERT INTO orders_services (order_id, service_package_id) 
    VALUES (${order_id},${data2}) 
    RETURNING *` 
    
  }
  console.log(query)
  pool.query(query)
    .then((result) => {
       res.status(201).json({
        success: true,
        message: `your event plan is created`,
        result: result.rows,
      });
    })
    .catch((err) => {
      console.error("Error creating order services:", err);
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};




const getAllOrders = (req, res) => {
  const query = `SELECT 
  o.order_id, 
  o.order_price, 

  o.event_name,

  o.eventDate, 
  o.place,
  os.service_id, 
  s.service_name, 
  s.details, 
  s.price, 
  s.image
FROM 
  orders o
  JOIN orders_services os ON o.order_id = os.order_id
  JOIN services s ON os.service_id = s.service_id
  JOIN users u ON o.user_id = u.user_id
WHERE 
  o.is_deleted = 0
  AND os.is_deleted = 0;`;

  pool
    .query(query)
    .then((result) => {
      if (result.rows.length !== 0) {
        res.status(200).json({
          success: true,
          message: "All the detailed order",
          result: result.rows,
        });
      } else {
        throw new Error("Error happened while getting orders");
      }
    })
    .catch((err) => {
       res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};
//this function get the order  by id with all details including the userName (client)
const getOrderById = (req, res) => {
  const orderId = req.params.id;

  const query = 
`

  SELECT 
    o.order_id, 
    o.order_price, 
    o.eventDate, 


    o.event_name,

    o.place, 
    u.userName,
    os.service_id, 
    s.service_name, 
    s.details, 
    s.price, 
    s.image,
    sp.package_id, 
    p.package_Name, 
    p.Description, 
    p.price package_price, 
    p.image package_image
FROM 
    orders o
JOIN 
    users u ON o.user_id = u.user_id
LEFT JOIN 
    orders_services os ON o.order_id = os.order_id
LEFT JOIN 
    services s ON os.service_id = s.service_id
LEFT JOIN 
    service_package sp ON os.service_package_id = sp.id
LEFT JOIN 
    package p ON sp.package_id = p.package_id
WHERE 
    o.order_id = $1
    AND o.is_deleted = 0
    AND os.is_deleted = 0;
`
  ;
  const data = [orderId];

  pool.query(query, data)
    .then((result) => {
      if (result.rows.length !== 0) {
        res.status(200).json({
          success: true,
          message: `Order details`,
          result: result.rows,
        });
      } else {
        throw new Error(`Order not found`);
      }
    })
    .catch((err) => {
      console.error("Error fetching order details:", err);
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message,
      });
    });
  
};

module.exports = {
  createNewOrder,
  createNewOrderServices,
  getAllOrders,
 getOrderById
};



