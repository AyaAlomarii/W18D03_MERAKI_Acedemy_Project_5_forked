const { pool } = require("../models/db");

//this function to create new service in the database
// End Point : POST /service
const createService = (req, res) => {
  const provider = req.token.userId;
  console.log("provider", req.token);
  const { service_name, details, price, image } = req.body;
  pool
    .query(
      `INSERT INTO services (service_name, details, price, image, provider)
       VALUES ($1,  $2, $3, $4, $5) RETURNING *`,
      [service_name, details, price, image, provider]
    )
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Service created successfully!",
        service: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        massage: "Server error",
        err: err.message,
      });
    });
};
//this function to get service by Name from the database
// End Point : GET /service/byName
const getServiceByName = (req, res) => {
  const serviceName = req.query.service_name;
  const query = `SELECT * FROM services WHERE service_name = $1 AND is_deleted=0;`;
  const data = [serviceName];
  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: `The name: ${serviceName} has no services`,
        });
      } else {
        res.status(200).json({
          success: true,
          message: `All services for the user: ${serviceName}`,
          result: result.rows,
        });
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

//this function to get All service from the database
// End Point : GET /service
const getAllServices = (req, res) => {
  pool

    .query("SELECT * FROM services WHERE services.is_deleted=0 order by service_id desc")

    .query(
      "SELECT * FROM services WHERE services.is_deleted=0 order by service_id desc"
    )

    .then((result) => {
      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: `No Services Found!`,
        });
      }
      res.status(200).json({
        success: true,
        message: `All the services`,
        services: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message,
      });
    });
};

// this function to Get all service by provider id
// EndPoint : GET /service/provider/:id
const getServiceByProviderId = (req, res) => {
  const id = req.params.id;
  pool
    .query(`SELECT * FROM services WHERE provider =$1 AND is_deleted=0`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,

          message: `No Services Found for this provider ${id}!`,
        });
      }
       return res.status(200).json({
        success: true,
        message: `All the services`,
        services: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message,
      });
    });
};

const getPendingService = (req, res) => {
  const pending = req.query.status;
  const query = "SELECT * FROM services WHERE status = $1 AND is_deleted=0";
  const data = [pending];

  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: `The status: ${pending} has no services`,
        });
      } else {
        res.status(200).json({
          success: true,
          message: `All services for the status: ${pending}`,
          result: result.rows,
        });
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
const updateServiceById = (req, res) => {
  const id = req.params.service_id;
  let { status } = req.body;

  const query = `UPDATE services SET status = COALESCE($1,status) WHERE service_id=$2 AND is_deleted = 0  RETURNING *`;
  const data = [status || null, id];
  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length !== 0) {
        res.status(200).json({
          success: true,
          message: `Service with id: ${id} updated successfully `,
          result: result.rows[0],
        });
      } else {
        throw new Error("Error happened while updating service");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};

// this function to delete a service By id
// EndPoint : GET /service/:id
const deleteServiceById = (req, res) => {


  const { id } = req.params;
>
  const userId = req.token.userId;
  console.log(id);
  pool
    .query(
      "UPDATE services SET is_deleted=1 WHERE service_id=$1 AND status='pending' AND provider =$2 RETURNING * ",
      [id, userId]
    )
    .then((result) => {
      console.log(result.rows);
      if (result.rows.length !== 0) {
        res.status(200).json({
          success: true,
          message: `Service with id: ${id} deleted successfully`,
          service: result.rows[0],
        });
      } else {
        pool
          .query(
            "SELECT * FROM services WHERE service_id=$1 AND provider =$2",
            [id, userId]
          )
          .then((result) => {
            if (result.rows.length !== 0) {
              res.status(400).json({
                success: false,
                message: `Cannot delete service with id: ${id} because its status is not 'pending'`,
              });
            } else {
              res.status(404).json({
                success: false,
                message: `Service with id: ${id} not found`,
              });
            }
          })
          .catch((err) => {
            res.status(500).json({
              success: false,
              message: "Server error",
              err: err,
            });
          });
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

// this function to Get all service by provider
// EndPoint : GET /service/provider
const getServiceByProvider = (req, res) => {
  const id = req.token.userId;
  pool

    .query(`SELECT * FROM services WHERE provider =$1 AND is_deleted=0 order by service_id desc`, [id])

    .query(
      `SELECT * FROM services WHERE provider =$1 AND is_deleted=0 order by service_id desc`,
      [id]
    )

    .then((result) => {
      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,

          message: `No Services Found for this provider ${id}!`,
        });
      }
      res.status(200).json({
        success: true,
        message: `All the services`,
        services: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message,
      });
    });
};

// this function to update Service
// EndPoint : PUT /service/provider/update/:id
// this function for service provider
const updateService = (req, res) => {
  const id = req.params.id;
  const { service_name, details, price, image } = req.body;
  pool
    .query(
      `UPDATE services 
     SET service_name = $1, details = $2, price = $3, image = $4
     WHERE service_id = $5 RETURNING *`,
      [service_name, details, price, image, id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "The service with the given ID was not found.",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Service has been updated.",
          service: result.rows[0],
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message,
      });
    });
};


// this function to get All orders  of a service provider
// EndPoint : GET /service/orders/all
// this function for service provider
const getAllOrdersOfProvider = (req, res) => {
  const id = req.token.userId;
  pool
    .query(
      `SELECT
  users.userName,
  services.service_name,
  services.image,
  services.price,
  orders.eventDate,
  orders.place
FROM
  orders
JOIN
  orders_services ON orders.order_id = orders_services.order_id
JOIN
  services ON orders_services.service_id = services.service_id
JOIN
  users ON services.provider = users.user_id
WHERE
  users.user_id = $1`,
      [id]
    )
    .then((result) => {
      if (!result.rowCount) {
        return res.status(404).json({
          success: false,
          message: "No orders yet",
        });
      }
      res.status(200).json({
        success: true,
        message: `All Order for service provider`,
        orders: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message,
      });
    });
};


module.exports = {
  createService,
  getAllServices,
  getServiceByName,
  updateServiceById,
  getServiceByProviderId,
  deleteServiceById,
  getPendingService,
  getServiceByProvider,
  updateService,
  getAllOrdersOfProvider,
};

