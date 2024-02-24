import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  MDBInput,
  MDBBtn,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Button, Modal, Nav } from "react-bootstrap";
const CreatePackage = () => {
  const [packages, setPackages] = useState([]);

  const [checkedPackages, setCheckedPackages] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const [modalShow, setModalShow] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [status, setStatus] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState({
    order_price: 0,
    eventDate: "",
    place: "",
  });
  useEffect(() => {
    axios
      .get(`http://localhost:5000/package/servicePackage`)
      .then((packages) => {
        console.log("packages", packages.data.result);
        setPackages(packages.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  //......................................................................................
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData({ ...orderData, [name]: value });
  };
//..........................................................................

  const getOrderDetails = async (orderId) => {
    try {
      const order = await axios.get(
        `http://localhost:5000/orders/search_1/${orderId}`
      );
      console.log("order", order);
      setOrderDetails(order.data.result[0]);
      // setSelectedServices(order.data.result);
      // console.log("SelectedServices", order.data.result);

      // setModalShow(true);
    } catch (error) {
      console.error("Error getting order details:", error);
    }
  };
  //.........................................................................................
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    //loader
    try {
      const orderResult = await axios.post(
        `http://localhost:5000/orders/create`,
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("orderResult",orderResult.data.result[0]);
      setOrderId(orderResult.data.result[0].order_id);
     
      //finding the selected packages to set the price 
      const selectedPackage = packages.find(
        (elem)=> elem.package_id === checkedPackages
      )
      console.log("selectedPackage",selectedPackage)

       
      const updateOrderPrice= {
        ...orderData,
        order_price: selectedPackage.price, //  order price = package price
      }
    
  
      setOrderData(updateOrderPrice);
     console.log("orderData",orderData,selectedPackage.price)

      //selected packages with the created order
      const orderPackageResult = await axios.post(
        `http://localhost:5000/orders/orderService/${orderResult.data.result[0].order_id}`,
        { service_package_id: checkedPackages },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("orderPackageResult",orderPackageResult.data);
      // setStatus(true);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: orderPackageResult.data.message,
      });
      setShowPreview(true);
    } catch (error) {
      //setStatus(false);
      Swal.fire({
        icon: "error",
        text: error.response.data.message,
      });
      console.error("Error creating order:", error);
    }
  };
  //........................................................................................

  const handleCheckboxChange = (packageId) => {
    console.log("checkedPackages", checkedPackages, "packageId", packageId);
    if (checkedPackages === packageId) {
      // If packageId is already checked, uncheck it
      setCheckedPackages(null);
    } else {
      setCheckedPackages(packageId);

    }
  };

  //......................................................................
  return (
    <div className="formContainer">
      <form onSubmit={handleSubmitOrder}>
        <MDBRow className="formInput">
          <MDBInput
            label="Event Date"
            type="date"
            id="eventDate"
            className="formInput"
            name="eventDate"
            value={orderData.eventDate}
            onChange={handleInputChange}
          />
        </MDBRow>
        <MDBRow className="formInput">
          <MDBInput
            label="Place"
            type="text"
            id="place"
            name="place"
            value={orderData.place}
            onChange={handleInputChange}
          />
        </MDBRow>

        <div className="cardContainer">
          {packages.map((Package) => (
            <MDBCard className="serviceCard">
              
              <MDBCardBody>
                <MDBCardTitle>name: {Package.package_name}</MDBCardTitle>

                <MDBCardText>
                  {/* {Package.image} */}
                  

                  <MDBCardImage
            src={Package.image}
            alt="..."
            position="top"
          />
                  <br />
                  <br />
                  description: {Package.description}
                  <br />
                  Price: JD {Package.price}
                  <br />
                </MDBCardText>

                <MDBCheckbox
                  label="Select"
                  checked={checkedPackages === Package.package_id}
                  onChange={() => handleCheckboxChange(Package.package_id)}

                  style={{
                    position: "absolute",
                    bottom: "20px", 
                    left: "20px",
                  }}

                />
              </MDBCardBody>
            </MDBCard>
          ))}
        </div>
        
        <MDBBtn type="submit"  color='dark'>
        Submit your plan
        </MDBBtn>
        </form>

      {showPreview ? (
        <div className="d-flex justify-content-end">
        <MDBBtn
          onClick={() => {
            setModalShow(true);
            console.log("orderData", orderData);
            getOrderDetails(orderId);
          }}
          className="totalPriceButton"
        >
          Preview the Order
        </MDBBtn>
      </div>
      ) : (
        <></>
      )}

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Your EVENT is now planned</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderDetails && (
            <div>
              <p>Event Date: {orderDetails.eventdate}</p>
              <p>Place: {orderDetails.place}</p>
              <p>Total Price: JD {orderDetails.order_price}</p>
              <p>Package Name :{orderDetails.package_name}</p>
              <p> Package details: {orderDetails.description}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
      
    </div>
  );
};

export default CreatePackage;
