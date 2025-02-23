const { pool } = require("../models/db");
// This function creates new package

const createNewPackage = (req, res) => {
  const { package_Name, price, Description, image, event } = req.body;
  const value = [package_Name, price, Description, image, event];
  const query = `INSERT INTO package (package_Name,price,Description,image,event) VALUES ($1,$2,$3,$4,$5) RETURNING *;`;
  pool
    .query(query, value)
    .then((result) => {
      console.log(result.rows);
      res.status(200).json({
        success: true,
        message: "package created successfully",
        result: result.rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};

//======================================================================
//this function for get all package with service details
const createNewServicePackage = (req, res) => {
  const { service_id, package_id } = req.body;
  const value = [service_id, package_id];
  const query = `INSERT INTO service_package ( service_id,package_id) VALUES ($1,$2) RETURNING *;`;
  pool
    .query(query, value)
    .then((result) => {
      console.log(result.rows);
      res.status(200).json({
        success: true,
        message: "service_package created successfully",
        result: result.rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err,
      });
    });
};
//======================================================================

//this function for getting all packages from packages services
const getAllPackagesServices = (req, res) => {
  const query = `
    SELECT * FROM service_package
    RIGHT OUTER JOIN package ON package.package_id = service_package.package_id
    LEFT OUTER JOIN services ON services.service_id = service_package.service_id
    `;

  pool
    .query(query)
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: `there is no packages available`,
        });
      } else {
        res.status(200).json({
          success: true,
          message: "All the packages",
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

//======================================================================

//this function for getting all packages from packages services
const getAllServicesByPackageId = (req, res) => {
  const { id } = req.params;
  const value = [id];
  const query = `
    SELECT * FROM service_package
    RIGHT OUTER JOIN package ON package.package_id = service_package.package_id
    LEFT OUTER JOIN services ON services.service_id = service_package.service_id
    WHERE package.package_id=$1
    `;

  pool
    .query(query, value)
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: `there is no services for package with id=${id}`,
        });
      } else {
        res.status(200).json({
          success: true,
          message: "All the services",
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
//This function updates the package By ID
const updatePackageById = (req, res) => {
  const id = req.params.id;
  let { price, description, package_Name } = req.body;

  const query = `UPDATE package SET price = COALESCE($1,price), 
  description = COALESCE($2, description), package_Name = COALESCE($3,package_Name) 
  WHERE package_id=$4 AND is_deleted = 0  RETURNING *;`;
  const data = [price || null, description || null,package_Name||null ,id];
  pool
    .query(query, data)
    .then((result) => {
      console.log("result",result.rows)
      if (result.rows.length !== 0) {
        res.status(200).json({
          success: true,
          message: `Package with id: ${id} updated successfully `,
          result: result.rows[0],
        });
      } else {
        throw new Error("Error happened while updating the package");
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

module.exports = {
  createNewPackage,
  createNewServicePackage,
  getAllPackagesServices,
  getAllServicesByPackageId,
  updatePackageById,
};
