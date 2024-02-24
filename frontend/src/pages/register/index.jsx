import React, { useState } from "react";

import "./style.css";
import axios from "axios";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import register from "../../assets/register.png";
//import {isLoggedIn} from "../../services/redux/reducer/auth/index";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBRadio,
} from "mdb-react-ui-kit";

//......................................................

const Register = () => {
  // const { isLoggedIn } = useSelector(
  //   (state) =>

  //     state.auth
  // );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const[role, setRole] = useState("");

 
  const [status, setStatus] = useState(false);
  //....................................

  const addNewUser = async () => {
    // e.preventDefault();
    console.log("register");
    try {
      const result = await axios.post("http://localhost:5000/users/register", {
        name,
        email,
        password,
        role,
      });
      console.log("registerResult", result);
      if (result.data.success) {
        setStatus(true);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: result.data.message,


          confirmButtonText: "Preview Order",

        });
      } else throw Error;
    } catch (error) {
      setStatus(false);
      Swal.fire({
        icon: "error",
        text: error.response.data.message,
      });
      // if (error.response && error.response.data) {
      //   return setMessage(error.response.data.message);
      // }
      // setMessage("Error happened while register, please try again");
    }
  };
  //............................
  const handleRadioChoice = (e) => {
    setRole(e.target.value);
    console.log(role, e.target.value);
  };
  return (
    <div>
      <MDBContainer className="register-form-container">
        <div className="container">
          <MDBRow>
            <MDBCard
              style={{ backgroundColor: "#f3f1ec" }}
              className="cardContainer"
            >
              <MDBCardBody>
                <h4 className="register-form-title">
                  Take your events to the next level with our innovative
                  planning platform
                </h4>
                <h4
                  className="register-form-title"
                  style={{ color: "#00a3af" }}
                >
                  Join us today!
                </h4>

                <MDBCol style={{ width: "100%" }} md="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    label="FullName"
                    size="lg"
                    id="form1"
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                  />
                </MDBCol>

                <MDBCol style={{ width: "100%" }} md="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    className="register-form-input"
                    label="Email"
                    size="lg"
                    id="form4"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </MDBCol>

                <MDBCol style={{ width: "100%" }} md="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    className="register-form-input"
                    label="password"
                    size="lg"
                    id="form2"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </MDBCol>

                <MDBRow>
                  <MDBCol md="6" className="mb-4">
                    <h6 className="fw-bold"> Join Us As : </h6>
                    <MDBRadio
                      name="inlineRadio"
                      id="inlineRadio1"
                      value="1"
                      label="Event Planner"
                      checked={role === "admin"} //admin role
                      onChange={handleRadioChoice}
                      inline
                    />
                    <MDBRadio
                      name="inlineRadio"
                      id="inlineRadio2"
                      value="2"
                      label="Service Provider"
                      checked={role === "serviceProvider"} //serviceProvider role
                      onChange={handleRadioChoice}
                      inline
                    />
                    <MDBRadio
                      name="inlineRadio"
                      id="inlineRadio3"
                      value="3"
                      label="Client"
                      checked={role === "client"} //client role
                      onChange={handleRadioChoice}
                      inline
                    />
                  </MDBCol>
                </MDBRow>

                <MDBBtn
                  color="dark"
                  style={{ width: "50%" }}
                  onClick={() => {
                    console.log("addNew");

                    addNewUser();
                  }}
                >
                  Submit
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBRow>
          <div>
            <h1 style={{ marginLeft: "20%" ,fontFamily: "Raleway"}}>
              Dream it....
              <span style={{ color: "#00a3af", fontFamily: "Raleway" }}>
                {" "}
                Build it{" "}
              </span>
            </h1>
            <img
              src="https://swankeventsboston.com/wp-content/uploads/2019/07/swank-events-boston-gallery-4.png"
              class="register-form-image"
              alt="Registration Image"
            ></img>
          </div>
        </div>
        {/* {status ? {message}: <p>{errorMessage}</p>} */}
      </MDBContainer>
    </div>
  );
};

export default Register;
