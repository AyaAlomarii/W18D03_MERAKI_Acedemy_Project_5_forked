import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
    CDBSidebarFooter,
  } from 'cdbreact';
  import { NavLink } from 'react-router-dom';
  const ServiceSideBar = () => {
      return (
          <CDBSidebar  /*  style={{backgroundColor:"white",color:"#ACDAD1"}} */ >
            <CDBSidebarHeader prefix={<i className="fa fa-bars" />}>Contrast</CDBSidebarHeader>
            <CDBSidebarContent>
              <CDBSidebarMenu>
                <NavLink to="pending/Services"><CDBSidebarMenuItem icon="th-large">Pending Services</CDBSidebarMenuItem></NavLink>
               <NavLink to={"packages"}> <CDBSidebarMenuItem icon="sticky-note">Components</CDBSidebarMenuItem></NavLink>
               <NavLink to={"Services"}> <CDBSidebarMenuItem icon="credit-card" iconType="solid">
                  Metrics
                </CDBSidebarMenuItem></NavLink>
              </CDBSidebarMenu>
            </CDBSidebarContent>
    
            <CDBSidebarFooter style={{ textAlign: 'center' }}>
              <div
                className="sidebar-btn-wrapper"
                style={{padding: '20px 5px'}}
              >
                Sidebar Footer
              </div>
            </CDBSidebarFooter>
          </CDBSidebar>
      );
    };
    
    export default ServiceSideBar;