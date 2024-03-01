import{createBrowserRouter} from "react-router-dom"
import ServiceProvider from "../pages/ServiceProvider"
import Login from "../pages/login"
import Register from "../pages/register"
import Home from "../pages/Home"


import Packages from "../pages/Package"


import CreateService from "../pages/CreateService"
import Client from "../pages/client"
import AdminDashboard from "../pages/AdminDashbored"
import PendingServices from "../pages/PendingServices"

import CreatePackage from "../pages/createPackage"
import AdminServicesRender from "../pages/AdminServicesRender"

// import Service from "../pages/Service/Service"
import Talk from "../pages/LetsTalk"
import About from "../pages/About"
import Navbar from "../components/Navbar"

import ServiceSideBar from "../components/ServiceSideBar"

import OrdersTable from "../pages/adminOrder"

import ServiceProviderOrders from "../pages/ServiceProviderOrder"

import Portfolio from "../pages/PortFolio"
import Footer2 from "../components/Footer/Footer2"
import Comp404 from "../pages/NotFound"
export const router= createBrowserRouter(
[
   {
      path:"/",
      element:<>  <Navbar/>
      <Home/> </>
     
     
   },
 

   {
      path:"/login",
      element:<Login/>,
       
  },
    {
        path:"service/provider",
        element: <>
        <div style={{height:"100vh",display:"grid",gridTemplateColumns:"0.5fr 4fr"}}>
        <ServiceSideBar/>
        <div className="d-flex flex-column">
        <ServiceProvider/>
        </div>
        </div>
        </>
    },
    {
        path:"service/provider/orders",
        element: <>
        <div style={{height:"100vh",display:"grid",gridTemplateColumns:"0.5fr 4fr"}}>
        <ServiceSideBar/>
        <div className="d-flex flex-column">
        <ServiceProviderOrders/>
        </div>
        </div>
        </>
    },

    {
      path:"/portfolio",
      element: 
      <> <Navbar/>
       <Portfolio/> 
       <Footer2/>
      </>
  },
  {
   path:"/letstalk",
   element:<> <Navbar/>
   <Talk/>
   <Footer2/>

   </> 
},
{
   path:"/AboutUs",
   element: <> <Navbar/>
   <About/>
   <Footer2/>

   </>
},
    { 
        path:"/register",

        element:<Register/>
     },{
        path:"/packages",
        element:<Packages/>
    },

 {
        path: "/service/provider/create",
        element: <>
        <div style={{height:"100vh",display:"grid",gridTemplateColumns:"0.5fr 4fr"}}>
        <ServiceSideBar/>
        <div className="d-flex flex-column">
        <CreateService/>
        </div>
        </div>
        </>



     },
     {
        path:"client",
        element:<>
        <Navbar/>
        <Client/>
        <Footer2/>

        </>

     },
    
     {
      path:"/admin/dashboard",
      element:<AdminDashboard/>,
      children:[
         {
            path:"pending/Services",
            element:<PendingServices/>
         },{
            path:"packages",
            element:<Packages/>,
            children:[
            {   path:"pending/Services",
            element:<PendingServices/>}

            ]
        },  {
         path:"Services",
         element:<AdminServicesRender/>
      },{
         path:"orders",
         element:<OrdersTable/>
      },
      ]
   },

    {
      path:"createPackage",
      element:<>
      <Navbar/>
      <CreatePackage/></>
    },
    {
      path:"*",
      element: 
      <Comp404/>
   
     
   },

]

)