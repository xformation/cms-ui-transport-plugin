import * as React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import '../../../css/college-settings.css';
import {
    VEHICLE_DATA_CACHE,INSURANCE_DATA_CACHE,GET_TRANSPORT_ROUTE_LIST, GET_STOPAGE_LIST,GET_TRANSPORT_ROUTE_STOPAGE_LIST, GET_VEHICLE_ROUTE_LIST, GET_VEHICLE_DRIVER_LIST
} from '../_queries';
 import { withApollo } from 'react-apollo';
 import wsCmsBackendServiceSingletonClient from '../../../wsCmsBackendServiceClient';
import AddRoute from './AddRoute';
import AddStopage from './AddStopage';
import AddTransportRouteStopage from './AddTransportRouteStopage';
import AddVehicleRouteLink from './AddVehicleRouteLink';
import AddVehicleDriverLink from './AddVehicleDriverLink';
import VehicleRouteListPage from './VehicleRouteListPage';
// import AddTransportRouteStopage from './AddTransportRouteStopage';
// import VehicleListPage from './VehicleListPage';
// import VehicleDetails from './VehicleDetails';
// import DriverListPage from '../DriverListPage/DriverListPage';
export interface VehicleProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    user?: any,
}
class vehicle extends React.Component<VehicleProps, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            activeTab: 0,
            user: this.props.user,
            transportRouteList: null,
            stopageList: null,
            vehicleList: null,
            vehicleFilterCacheList: null,
            insuranceFilterCacheList:null,
            transportRouteStopageList: null,
            vehicleRouteList: null,
            vehicleDriverList: null,
            branchId: null,
            academicYearId: null,
            departmentId: null,
        };
        this.toggleTab = this.toggleTab.bind(this);
        this.registerSocket = this.registerSocket.bind(this);
        this.getVehicleFilterCacheList = this.getVehicleFilterCacheList.bind(this);
        this.getTransportRouteList = this.getTransportRouteList.bind(this);
        this.getStopageList = this.getStopageList.bind(this);
        this.getTransportRouteStopageList = this.getTransportRouteStopageList.bind(this);
        this.getTransportRouteVehicleList = this.getTransportRouteVehicleList.bind(this);
        this.getVehicleDriverList = this.getVehicleDriverList.bind(this);
        // this.getInsuranceFilterCacheList = this.getInsuranceFilterCacheList.bind(this);
    }
    

    registerSocket() {
        const socket = wsCmsBackendServiceSingletonClient.getInstance();
    
        socket.onmessage = (response: any) => {
            let message = JSON.parse(response.data);
            console.log("Vehicle Index. message received from server ::: ", message);
            this.setState({
                branchId: message.selectedBranchId,
                academicYearId: message.selectedAcademicYearId,
                departmentId: message.selectedDepartmentId,
            });
            console.log("Vehicle Index. branchId: ",this.state.branchId);
            console.log("Vehicle Index. departmentId: ",this.state.departmentId);  
            console.log("Vehicle Index. ayId: ",this.state.academicYearId);  
        }
    
        socket.onopen = () => {
            console.log("Vehicle Index. Opening websocekt connection to cmsbackend. User : ",this.state.user.login);
            socket.send(this.state.user.login);
        }
    
        window.onbeforeunload = () => {
            console.log("Vehicle. Closing websocket connection with cms backend service");
        }
      }

    toggleTab(tabNo: any) {
        if(tabNo === 0 ){
            this.getVehicleFilterCacheList();
        }
        if(tabNo===1){
            // this.getStopageList();
            this.getVehicleFilterCacheList();
        }
        if(tabNo === 2 ){
            this.getVehicleFilterCacheList();
            this.getTransportRouteVehicleList();
        }
        if(tabNo === 3 ){
            this.getVehicleFilterCacheList();
            this.getTransportRouteStopageList();
        }
        
        if(tabNo === 4 ){
            this.getVehicleFilterCacheList();
            this.getVehicleDriverList();
        }
        if(tabNo === 5 ){
            this.getVehicleFilterCacheList();
        }
        this.setState({
            activeTab: tabNo,
        });
    }
    async getStopageList(){
        const {data} = await this.props.client.query({
            query: GET_STOPAGE_LIST,
            variables: {
            },
            fetchPolicy: 'no-cache',
          });
          this.setState({
            stopageList: data,
          });
    }
    async getVehicleDriverList(){
        const { data } =  await this.props.client.query({
            query: GET_VEHICLE_DRIVER_LIST,
            fetchPolicy: 'no-cache'
        })
        this.setState({
            vehicleDriverList: data
        });
    }
    async getTransportRouteStopageList(){
        const { data } = await this.props.client.query({
            query: GET_TRANSPORT_ROUTE_STOPAGE_LIST,
             fetchPolicy: 'no-cache'
        })
        this.setState({
            transportRouteStopageList: data
        });
    }
    async getTransportRouteVehicleList(){
        const { data } = await this.props.client.query({
            query: GET_VEHICLE_ROUTE_LIST,
             fetchPolicy: 'no-cache'
        })
        this.setState({
            vehicleRouteList: data
            
        });
    }
    async getTransportRouteList(){
        const {data} = await this.props.client.query({
            query: GET_TRANSPORT_ROUTE_LIST,
            variables: {
            },
            fetchPolicy: 'no-cache',
          });
          this.setState({
            transportRouteList: data,
          });
    }
    async getVehicleFilterCacheList() {
        const {data} = await this.props.client.query({
          query: VEHICLE_DATA_CACHE,
            variables: {
            },
          
          fetchPolicy: 'no-cache',
        });
        this.setState({
            vehicleFilterCacheList: data,
        });
      }
      async getInsuranceFilterCacheList() {
        const {data} = await this.props.client.query({
          query: INSURANCE_DATA_CACHE,
            variables: {
            },
          
          fetchPolicy: 'no-cache',
        });
        this.setState({
            insuranceFilterCacheList: data,
        });
      }
    render() {
        const { activeTab,stopageList,vehicleFilterCacheList,vehicleDriverList, vehicleRouteList, transportRouteStopageList,transportRouteList,insuranceFilterCacheList,user } = this.state;
        return (
            <section className="tab-container row vertical-tab-container">
                 <Nav tabs className="pl-3 pl-3 mb-4 mt-4 col-sm-2">
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 0 ? 'side-active' : ''}`} onClick={() => 
                            { this.toggleTab(0); }} >
                            Add Route Page
                        </NavLink>
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 1 ? 'side-active' : ''}`} onClick={() => 
                            { this.toggleTab(1); }} >
                            Add Stop page
                        </NavLink> 
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 2 ? 'side-active' : ''}`} onClick={() => 
                            { this.toggleTab(2); }} >
                           Vehicle Route Details
                        </NavLink>
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 3 ? 'side-active' : ''}`} onClick={() => 
                            { this.toggleTab(3); }} >
                           Route Stopage Details
                        </NavLink>
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 4 ? 'side-active' : ''}`} onClick={() => 
                            { this.toggleTab(4); }} >
                           Vehicle Driver Details
                        </NavLink>
                   </NavItem>
                   <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 5? 'side-active' : ''}`} onClick={() => 
                            { this.toggleTab(5); }} >
                           TransportRoute List Page 
                        </NavLink>
                   </NavItem>
                </Nav>
                <TabContent activeTab={activeTab} className="col-sm-9 border-left p-t-1">
     
               <TabPane tabId={0}>
                         <AddRoute/>
                         {/* 
                        {
                            user !== null && transportRouteList !== null && (
                                <AddRoute user={user} transportRouteList={transportRouteList.getTransportRouteList} />
                            )
                        } 
                         {
                            user !== null && vehicleFilterCacheList !== null?
                                <AddRoute user={user} vehicleFilterCacheList={vehicleFilterCacheList.createVehicleDataCache}/>
                            :
                            null
                        }  */}
                    </TabPane>
                    <TabPane tabId={1}>
                    {
                            user !== null && vehicleFilterCacheList !== null?
                                <AddStopage user={user} vehicleFilterCacheList={vehicleFilterCacheList.createVehicleDataCache}/>
                            :
                            null
                        }
                    {/* {
                            user !== null && stopageList !== null && (
                                <AddStopage user={user} stopageList={stopageList.getStopageList}/>
                            )
                        }       */}
                        {/* ADD STOPAGE */}
                    </TabPane>
                    <TabPane tabId={2}>
                    {
                            user !== null && vehicleFilterCacheList !== null && vehicleRouteList !== null &&(
                                <AddVehicleRouteLink user={user} vehicleFilterCacheList={vehicleFilterCacheList.createVehicleDataCache} vehicleRouteList={vehicleRouteList.getTransportRouteVehicleList}/>
                            // :
                            // null
                            )
                        }
                    </TabPane>
                 <TabPane tabId={3}>
                 {
                            user !== null && vehicleFilterCacheList !== null && transportRouteStopageList !== null &&(
                                <AddTransportRouteStopage user={user} vehicleFilterCacheList={vehicleFilterCacheList.createVehicleDataCache} transportRouteStopageList={transportRouteStopageList.getTransportRouteStopageList}/>
                            // :
                            // null
                            )
                        }
                    </TabPane>
                    <TabPane tabId={4}>
{
                            user !== null && vehicleFilterCacheList !== null && vehicleDriverList !== null && (
                                <AddVehicleDriverLink user={user} vehicleFilterCacheList={vehicleFilterCacheList.createVehicleDataCache} vehicleDriverList={vehicleDriverList.getVehicleDriverList}/>
                            // :
                            // null
                            )
                        }                   
                         </TabPane>
                    <TabPane tabId={5}>
                    {
                            user !== null && vehicleFilterCacheList !== null && (
                                <VehicleRouteListPage user={user} vehicleFilterCacheList={vehicleFilterCacheList.createVehicleDataCache}/>
                            // :
                            // null
                            )
                        }  
                    </TabPane>
                </TabContent> 
            </section>
        );
    }
}
export default withApollo(vehicle)