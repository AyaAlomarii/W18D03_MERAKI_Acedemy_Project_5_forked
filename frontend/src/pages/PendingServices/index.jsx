import React,{  useEffect, useState } from "react";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { setPendingServices,updateServiceStatusById } from "../../services/redux/reducer/PendingServices";
import {
  MDBCardTitle,
  MDBCardText,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBBtn,
  MDBInput,
  MDBRow,
  MDBTypography,
  MDBBtnGroup 
} from "mdb-react-ui-kit";

//http://localhost:5000/service/byStatus?status=pending



const PendingServices = () => {
    const dispatch = useDispatch();
      const { isLoggedIn,token } = useSelector(
    (state) =>
      
      state.auth
  );
    const getPendingService = () => {
        axios
          .get("http://localhost:5000/service/byStatus?status=pending")
          .then((result) => {
           console.log(result.data.result);
           dispatch(setPendingServices(result.data.result));
          })
          .catch((err) => {
            console.log(err);
          });
      };
      useEffect(() => {
      getPendingService()
      }, []);
  //---------------------------handel confirm /reject btn
      const handelStatus = (status,id) => {
         axios
          .put(`http://localhost:5000/service/${id}`,
          {status},
          {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((result) => {
           console.log(result.data.result);
          dispatch(updateServiceStatusById(id))
          })
          .catch((err) => {
            console.log(err);
          });
      };

        const {pendingServices} = useSelector((state)=> 
        state.pendingServices

    )   
    return (
        <>

          <MDBContainer className="py-5 ">
          
              
                <MDBRow style={{marginBottom:"80px"}} className="justify-content-right align-items-center h-100"> 
            {pendingServices.length===0?<>no pending services available</>:<>{pendingServices.map((service,i)=>{
return(
 
 <MDBCol key={i}  size={"sm"} sm="3"> <MDBCard style={{padding:"10px"}}>
          <MDBCardImage
            src="https://mdbootstrap.com/img/new/standard/city/042.webp"
            alt="..."
            position="top"
          />
          <MDBCardBody >
            <MDBCardTitle>{service.service_name}</MDBCardTitle>
            <MDBCardText>
            <span className="text-muted">Provider: </span>{service.provider}<br/>
            </MDBCardText>
            <MDBCardText>
                  
          <span className="text-muted">Details: </span>{service.details}<br/>
            </MDBCardText>
            <MDBCardText>
                  
            <span className="text-muted">Status: </span>{service.status}
                    </MDBCardText>
                    <MDBTypography tag="h5" className="mb-0">
        {service.price} JOD
      </MDBTypography>
      
      
      <MDBBtn onClick={()=>{
        handelStatus("confirmed",service.service_id)
      }} color='secondary' outline>
        Confirm
      </MDBBtn>
      
      <MDBBtn onClick={()=>{
        handelStatus("Rejected",service.service_id)
      }} color='secondary' outline>
        Reject
      </MDBBtn>
    
          </MDBCardBody>
        </MDBCard>
        </MDBCol>
       
)
            })}</>}
      
      </MDBRow>
             {/*    <MDBCard>
                  <MDBCardBody>
                    <MDBBtn className="ms-3" color="warning" block size="lg">
                      Apply
                    </MDBBtn>
                  </MDBCardBody>
                </MDBCard> */}
          
          </MDBContainer>
          </>
        );
}

export default PendingServices
