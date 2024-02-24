import { useEffect } from "react";
import {
  MDBInput,
  MDBBtn,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCheckbox,

  MDBCardImage
} from "mdb-react-ui-kit";
import {Button,Modal,Nav} from "react-bootstrap";


  MDBCardImage,
} from "mdb-react-ui-kit";
import { Button, Modal, Nav } from "react-bootstrap";


import { useSelector } from "react-redux";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";

import "./style.css";
//.....................................

const Client = () => {
  // const { isLoggedIn } = useSelector((state) => state.auth);
  const [showPrice, setShowPrice] = useState(false);
  const [ClickedPrice, setClickedPrice] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState(false);
  const [checkedServices, setCheckedServices] = useState([]);

  const [modalShow, setModalShow] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [SelectedServices, setSelectedServices] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState({
    order_price: 0,
    event_name: "",
    eventDate: "",
    place: "",
    event_name:""
  });

  //...................................................................................
  useEffect(() => {
    axios
      .get(`http://localhost:5000/service`)
      .then((services) => {
        console.log("services", services.data);
        setServices(services.data.services);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //..................................................................................
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData({ ...orderData, [name]: value });
  };
  //...................................................................................
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
      console.log(orderResult.data.result[0]);
      setOrderId(orderResult.data.result[0].order_id);
      //selected services with the created order
      const orderServiceResult = await axios.post(
        `http://localhost:5000/orders/orderService/${orderResult.data.result[0].order_id}`,
        { service_ids: checkedServices },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(orderServiceResult.data);
      setStatus(true);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: orderServiceResult.data.message,
      });
      setShowPreview(true);
    } catch (error) {
      // setStatus(false);
      // Swal.fire({
      //   icon: "error",
      //   text: error.response.data.message
      // });
      console.error("Error creating order:", error);
    }
  };

  const handleOrderPrice = (e) => {
    e.preventDefault();
    const totalOrderPrice = checkedServices.reduce((total, serviceId) => {
      const selectedService = services.find(
        (service) => service.service_id === serviceId
      );

      return total + selectedService.price;
    }, 0);
    console.log("total price", totalOrderPrice);
    setOrderData({ ...orderData, order_price: totalOrderPrice });
    setClickedPrice(true);
  };

  //.........................................................................................

  const handleCheckboxChange = (serviceId) => {
    //reduce HOF to calculate the total order price as summation of checked services

    console.log("checkedServices", checkedServices, "serviceId", serviceId);
    if (checkedServices.includes(serviceId)) {
      // Remove serviceId if already checked
      setCheckedServices(checkedServices.filter((id) => id !== serviceId));
    } else {
      // Add serviceId if not checked
      setCheckedServices([...checkedServices, serviceId]);

      setShowPrice(true);
    }
  };
  //..........................................................................................

  const getOrderDetails = async (orderId) => {
    try {
      const order = await axios.get(
        `http://localhost:5000/orders/search_1/${orderId}`
      );
      console.log("Detailsorder", order);

      setOrderDetails(order.data.result[0]);

      console.log("date", order.data.result[0].eventdate);
      setOrderDetails(order.data.result[0]);


      setSelectedServices(order.data.result);
      console.log("SelectedServices", order.data.result);

      // setModalShow(true);
    } catch (error) {
      console.error("Error getting order details:", error);
    }
  };

  //..........................................................................................

  return (
    <div className="formContainer">

      <h2>Plan your event by these services or choose from our <span><Nav.Link href="CreatePackage">Packages</Nav.Link></span></h2>

     
      <form >
      <MDBRow className="formInput">

<div style={{margin:"1rem"}}>
      <h2>
        Plan your event using these services or choose from our{" "}
        <span>
          <Nav.Link href="CreatePackage">Packages</Nav.Link>
        </span>
      </h2></div>
<h6 style={{marginTop: "1rem", borderTop: "1px solid #00a3af", padding: "1rem 0 0 0"}}> Fill the information please </h6>
      <form>
        <MDBRow className="formInput">

          <MDBInput
            label="Event name"
            type="text"
            id="event_name"
            name="event_name"
            value={orderData.event_name}
            onChange={handleInputChange}
          />
        </MDBRow>
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
          {services.map((service) => (
            <MDBCard className="serviceCard">

              <MDBCardBody>
                <MDBCardTitle> Service name: {service.service_name}</MDBCardTitle>
                <MDBCardImage
            src={service.image}
            alt="..."
            position="top"
            className="cardImg"
          />
                <MDBCardText>
                  {/* {service.image} */}
                  Price: JD {service.price}
                  <br />
                  description: {service.details}

              <MDBCardBody style={{ marginBottom: "0" }}>
                <MDBCardTitle>
                  <p
                    style={{
                      textAlign: "center",
                      fontFamily: "Raleway",
                      borderBottom: "1px solid #00A3AF",
                    }}
                  >
                    {" "}
                    <strong>{service.service_name}</strong>
                  </p>
                </MDBCardTitle>
                <br />
                <MDBCardImage
                  src={service.image}
                  alt="..."
                  position="top"
                  className="cardImg"
                />

                <MDBCardText>
                  <p
                    style={{
                      textAlign: "justify",
                      borderBottom: "1px solid #00A3AF ",
                      fontFamily: "Raleway",
                    }}
                  >
                    <strong>Price:</strong>{" "}
                    <span style={{ display: "inline" }}>
                      JD {service.price}
                    </span>
                  </p>
                  <p
                    style={{
                      
                      textAlign:"justify",
                                        fontFamily:"Crimson",
                      margin:"auto",
                      padding:"auto",
                      wordSpacing: "normal"
                    }}
                  >
                    <strong>Description:</strong>{" "}
                    <span style={{ display: "inline", fontFamily:"Crimson" ,textAlign:"justify"}}>{service.details}</span>
                  </p>
                  <br/>

                </MDBCardText>
                 <div className="checkBox" style={{
                  fontFamily:"Raleway",
                  fontWeight:"bold",
                    position: "absolute",
                    bottom: "15px", 
                    left: "20px",
                    }}>
                <MDBCheckbox
                  label="Select"
                  checked={checkedServices.includes(service.service_id)}
                  onChange={() => handleCheckboxChange(service.service_id)}
                  
                /></div>
              </MDBCardBody>
            </MDBCard>
          ))}
        </div>

<
       
      
  {}
        
      </form>

      {showPreview ? (
    <div className="d-flex justify-content-end">
      <MDBBtn
        onClick={() => {
          setModalShow(true);
          console.log("orderData.order_id", orderData);
          getOrderDetails(orderId);
        }}
        className="totalPriceButton"
      >
        Preview the Order
      </MDBBtn>
    </div>
  ) : (
    <>
    
    <div className="price">
      {showPrice ? (
          <>
          <div >
            <MDBBtn className="totalPriceButton"  onClick={handleOrderPrice}>
             {ClickedPrice ?<p> Total Price :{orderData.order_price}</p>: "calculate the total Price"} 
            </MDBBtn></div>
            <MDBBtn  onClick={handleSubmitOrder} 
        className="totalPriceButton" color='dark'>
          Submit your plan
        </MDBBtn>
          </>
        ) : (
          <></>
        )}

{/* {ClickedPrice ? (

        {}
      </form>

      {showPreview ? (
        <div className="price">
          <MDBBtn
            onClick={() => {
              setModalShow(true);
              console.log("orderData", orderData);
              getOrderDetails(orderId);
            }}
            className="totalPriceButton"
            color="dark"
          >
            Preview the Order
          </MDBBtn>
        </div>
      ) : (
        <>
          <div className="price">
            {showPrice ? (
              <>
                <MDBBtn
                  className="totalPriceButton"
                  color="dark"
                  onClick={handleOrderPrice}
                >
                  {ClickedPrice ? (
                    <p> Total Price :{orderData.order_price}</p>
                  ) : (
                    "calculate the total Price"
                  )}
                </MDBBtn>
                <MDBBtn
                  onClick={handleSubmitOrder}
                  className="totalPriceButton"
                  color="dark"
                >
                  Submit your plan
                </MDBBtn>
              </>
            ) : (
              <></>
            )}

            {/* {ClickedPrice ? (

          <>
            <MDBRow className="mb-4">
              <p>Total Price: JD {orderData.order_price}</p>
            </MDBRow>
          </>
        ) : (
          <></>
        )} */}

</div>
    
    </>
  )}

          </div>
        </>
      )}


      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Your EVENT is now planned</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {orderDetails && (
            <div>
              <p>Event: {orderDetails.event_name}</p>
              <p>Event Date: {orderDetails.eventdate}</p>
              <p>Place: {orderDetails.place}</p>
              <p>Total Price: JD {orderDetails.order_price}</p>

              <p>Selected Services:</p>
              <ul>
                {SelectedServices.map((service) => (
                  <li>
                    <p>Name: {service.service_name}</p>
                    <p>Details: {service.details}</p>

        <Modal.Body className="modalshowing">
          {orderDetails && (
            <div>
              {/* <p> <strong></strong> <span>{orderDetails.event_name}</span></p>
             <strong> </strong><span>{}</span> */}
              {/* <strong></strong>: <p>{orderDetails.eventdate}</p> */}
              <p>
                {" "}
                <strong> Event: </strong> {orderDetails.event_name}
              </p>
              <p>
                {" "}
                <strong> Event Planner: </strong> {orderDetails.username}
              </p>
              <p>
                {" "}
                <strong> Event Date: </strong> {orderDetails.eventdate}
              </p>
              <p>
                {" "}
                <strong>Place:</strong> {orderDetails.place}{" "}
              </p>

              <p>
                {" "}
                <strong>Total Price: </strong> {orderDetails.order_price} JD
              </p>

              <p style={{ borderBottom: "none" }}>
                {" "}
                <strong>Selected Services:</strong>
              </p>
              <ul>
                {SelectedServices.map((service) => (
                  <li>
                    <strong>Name: {service.service_name}</strong>
                    <p>
                      <strong>Details</strong>: {service.details}
                    </p>

                  </li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>

          <Button onClick={() => setModalShow(false)}>Close</Button>

          <Button variant="dark" onClick={() => setModalShow(false)}>
            Close
          </Button>

        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Client;
