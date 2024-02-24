import React, { useEffect } from "react";
import { MDBInput, MDBBtn,MDBRow,MDBCard, MDBCardBody, MDBCardTitle, MDBCardText,MDBCardImage, MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem ,MDBCheckbox} from 'mdb-react-ui-kit';
import { useSelector ,useDispatch} from "react-redux";
import axios from "axios";
import { useState } from "react";
import { setPackages,setPackagesName } from "../../services/redux/reducer/packages";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import Swal from 'sweetalert2';
import Modal from "react-bootstrap/Modal";

function AdminServicesRender() {
  const [packageDetails, setPackageDetails] = useState(null);
  const [showPrice, setShowPrice] = useState(false);

  const [modalShow, setModalShow] = useState(false);
const [package_id, setPackageId] = useState(null)
  const dispatch=useDispatch()
    const { isLoggedIn,token } = useSelector((state) => state.auth);
  
   
    const { packages,packagesName  } = useSelector((state) => state.packages);
    const [services, setServices] = useState([]);
    const [messageForAddService, setMessageForAddService] = useState(false);
    const [packageInfo, setPackageInfo] = useState({price:0,
      package_Name:"",
      Description:"",
      image:"",
      event:"test"
    });
    const [checkedServices, setCheckedServices] = useState([]);
    const [ClickedPrice, setClickedPrice] = useState(false);

    //-----------------------------

  //..................................................................................
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPackageInfo({ ...packageInfo, [name]: value });
  };
  //...................................................................................
  const handleSubmitPackage = async (e) => {
    e.preventDefault();
    //loader
    try {
      const packageResult = await axios.post(
        `http://localhost:5000/package/create`,
        {packageInfo},

      );
      console.log(packageResult.data.result);
      console.log(1111,packageResult.data.result.package_id);

     setPackageId(packageResult.data.result.package_id)
      //selected services with the created order
      //""
      const packageServiceResult = await axios.post(
        
        `http://localhost:5000/package/create/servicePackage/${packageResult.data.result.package_id}`,
        { service_ids: checkedServices },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(packageServiceResult.data);
      //setStatus(true);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: packageServiceResult.data.message,
      });  
    } catch (error) {
      console.error("Error creating order:", error);
      console.log(package_id,1212);
    }
  };

  const handlePackagePrice = (e) => {
    e.preventDefault();
    const totalOrderPrice = checkedServices.reduce((total, serviceId) => {
      const selectedService = services.find(
        (service) => service.service_id === serviceId
      );

      return total + selectedService.price;
    }, 0);
    console.log("total price", totalOrderPrice);
    setPackageInfo({ ...packageInfo, price: totalOrderPrice });
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


  const getPackageDetails = async (package_id) => {
    try {
      const packageService = await axios.get(`http://localhost:5000/package/${package_id}`);
      console.log("Detailsorder",packageService.data.result)
      setPackageDetails(packageService.data.result[0]);

      setModalShow(true);
    } catch (error) {
      console.error("Error getting package details:", error);
    }
  };




  //..........................................................................................
    //-----------------------------

    //-----------------------------

const callServices=()=>{
  axios
  .get(`http://localhost:5000/service`, {
    
  })
  .then((result) => {
   // console.log("services", result.data.services);
    setServices(result.data.services);
    
    
  })
  .catch((err) => {
    
    console.log(err);

  });

}
    //-----------------------------
    
  
const AddServiceToPackage=async (package_id,service_id)=>{

    try {
      const result = await axios
      .post(
        "http://localhost:5000/package/create/servicePackage",
        { package_id,service_id} ,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      console.log("registerResult",result)
      if (result.data.success) {
        console.log(result.data);
        setMessageForAddService(true)

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: "Service Added Successfully",
          confirmButtonText: 'Hide'
        });
        
      } else throw Error;
    } catch (error) {
      setMessageForAddService(false)

      console.log(err);
      Swal.fire({
        icon: "error",
        text: error.response.data.message,
      });

    }
}

    //-----------------------------


    useEffect(() => {
      callServices()
      }, []);
    //...............................
  return (
    <> <div className="formContainer">
    <h1>
      create  <a>package</a> 
    </h1>
    
    <form   >
    <MDBRow className="formInput">
        <MDBInput
          label="Package Name"
          type="text"
          id="package_Name"
          name="package_Name"
          value={packageInfo.package_Name}
          onChange={handleInputChange}
        />
      </MDBRow>

      <MDBRow rows={4} className="formInput">
      <MDBInput wrapperClass='mb-4'  label="Description"
          type="text"
          id="Description"
          name="Description"
       value={packageInfo.Description}
        onChange={handleInputChange} />
      </MDBRow>
       <MDBRow  className="formInput">
      <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Image
              </label>
              <input
                type="file"
                className="form-control"
                id="image"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
      </MDBRow> 

      <div className="cardContainer">
        {services.map((service,i) => (
          <MDBCard key={i} className="serviceCard">
            <MDBCardBody>
            <MDBCardImage
            src={service.image}
            alt="..."
            position="top"
          />
              <MDBCardTitle>name: {service.service_name}</MDBCardTitle>

              <MDBCardText>
              
                Price: JD {service.price}
                <br />
                description: {service.details}
              </MDBCardText>

              <MDBCheckbox
                label="Select"
               checked={checkedServices.includes(service.service_id)}
                 onChange={() => handleCheckboxChange(service.service_id)}
              />
            </MDBCardBody>
          </MDBCard>
        ))}
      </div>

      {showPrice ? (
        <>
          <MDBBtn className="totalPriceButton" onClick={handlePackagePrice}
          >
            calculate the total Price
          </MDBBtn>
        </>
      ) : (
        <></>
      )}

      {ClickedPrice ? (
        <>
          <MDBRow className="mb-4">
            <p>Total Price: {packageInfo.price} JD</p>
          </MDBRow>
        </>
      ) : (
        <></>
      )}

      <MDBBtn type="submit"   className="totalPriceButton" onClick={handleSubmitPackage}>Submit your Package</MDBBtn>
    </form>
    
    <MDBBtn onClick={() => {setModalShow(true)
    console.log("orderData.order_id",packageInfo)
    getPackageDetails(package_id)
  
  
  }
    
  
  
  
  } 
     
      
      className="totalPriceButton">
        Preview the package
      </MDBBtn>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Your package is now Ready</Modal.Title>
        </Modal.Header>
        <Modal.Body>
      {packageDetails && (
    <div>
           "",
      :"",
      image:"",
      event:"test"
             <p> package Name: {packageDetails. package_Name}</p>
      <p>Description: {packageDetails.Description}</p>
      <p>Total Price:  {packageDetails.price}JD</p>
      <p>event {packageDetails.event}</p>

      <p>Services:</p> 
      
    </div>
  )} 

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    
  </div></>
  )
}

export default AdminServicesRender