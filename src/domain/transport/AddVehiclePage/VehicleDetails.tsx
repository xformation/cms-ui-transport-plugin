// import * as React from 'react';
// import {withApollo} from 'react-apollo';
// import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';

// type VehicleTableStates = {
//     user: any;
//     activeTab: any;
//     vObj: any;
//   };

// export interface VehicleDetailsProps extends React.HTMLAttributes<HTMLElement> {
//     [data: string]: any;
//     user?: any;
//   }
//   class VehicleDetailsPage<T = {[data: string]: any}> extends React.Component<VehicleDetailsProps,VehicleTableStates> {
//   constructor(props: any) {
//     super(props);
//     this.state = {
//      activeTab: 0,
//      vObj: this.props.data,
//      user: this.props.user,
//     };
//     this.toggleTab = this.toggleTab.bind(this);
//   }
//   async componentDidMount() {
//     this.setState({
//       vObj: this.props.data,
//     });
//   }

//   componentWillReceiveProps() {
//     this.setState({
//       vObj: this.props.data,
//     });
//   }
//   toggleTab(tabNo: any) {
//     this.setState({
//       activeTab: tabNo,
//     });
//   }

//   render() {
//     const {activeTab, vObj} = this.state;
//     console.log('Check the new obj in another page:', vObj);
//     return (
//         <section className="student-profile-container">
//           <div className="plugin-bg-white">
//             <div>
//               <div className="b-1 m-1">
//                 <div className="p-m-1">
//                   <Nav tabs className="" id="rmfloat">
//                     <NavItem className="cursor-pointer">
//                       <NavLink
//                         className={`${activeTab === 0 ? 'active' : ''}`}
//                         onClick={() => {
//                           this.toggleTab(0);
//                         }}
//                       >
//                         Vehicle Details
//                       </NavLink>
//                     </NavItem>
//                     {/* <NavItem className="cursor-pointer">
//                       <NavLink
//                         className={`${activeTab === 1 ? 'active' : ''}`}
//                         onClick={() => {
//                           this.toggleTab(1);
//                         }}
//                       >
//                         Contract
//                       </NavLink>
//                     </NavItem>
//                     <NavItem className="cursor-pointer">
//                       <NavLink
//                         className={`${activeTab === 2? 'active' : ''}`}
//                         onClick={() => {
//                           this.toggleTab(2);
//                         }}
//                       >
//                         Insurance
//                       </NavLink>
//                       </NavItem>*/}
//                   </Nav>
//                   <TabContent activeTab={activeTab} className="ltab-contianer p-0">
//                     <TabPane tabId={0}>
//                       <span>
//                       <div className="p-2">
//                   <div className="details-container">
//                     <div className="row">
//                       <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
//                         <span className="profile-label w-8">
//                           Vehicle No:
//                         </span>
//                         <span className="">{vObj.vehicleNumber}</span>
//                       </div>
//                       <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
//                         <span className="profile-label w-12">
//                           Vehicle Type:
//                         </span>
//                         <span className="">{vObj.vehicleType}</span>
//                       </div>
//                       <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
//                         <span className="profile-label w-10">
//                           Date Of Registration: </span>
//                         <span className="">{vObj.strDateOfRegistration}</span>

//                       </div>
//                     </div>
//                     <div className="row">
//                       <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
//                         <span className="profile-label w-8">
//                           Rc No:</span>
//                         <span className="">{vObj.rcNo}</span>
//                       </div>
//                       <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
//                         <span className="profile-label w-12">
//                           Year Of Manufacturing:</span>
//                         <span className="">{vObj.yearOfManufacturing}</span>
//                       </div>
//                       <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
//                         <span className="profile-label w-10">
//                           Chasis No:</span>
//                         <span className="">{vObj.chasisNo}</span>
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
//                         <span className="profile-label w-8">
//                           Capacity: </span>
//                         <span className="">{vObj.capacity}</span>
//                       </div>
//                       <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
//                         <span className="profile-label w-12">
//                           Manufacturing Company: </span>
//                         <span className="">{vObj.manufacturingCompany}</span>
//                       </div>
//                       <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
//                         <span className="profile-label w-10">
//                           Ownership: </span>
//                         <span className="">{vObj.ownerShip}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="details-container">
//                     <div className="row">
//                       <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
//                         <span className="profile-label w-8">
//                          Model: </span>
//                         <span className="">{vObj.model}</span>
//                       </div>
//                       {/* <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
//                         <span className="profile-label w-12">
//                           Contact Number:
//                       </span>
//                         <span className="">{vObj.contactNumber}</span>
//                       </div> */}
//                     </div>
//                   </div>
//                 </div>
//                 </span>
//                     {/* </TabPane>
//                     <TabPane tabId={1}>
//                       <span>
//                       <div className="p-2">
//                   <div className="details-container">
//                     <div className="row">
//                       <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
//                         <span className="profile-label w-8">
//                           Vendor Name:
//                         </span>
//                         {vObj.contract !== undefined && (

//                           <span >{vObj.contract.vendorName}</span>
//                         )}
//                       </div>
//                       <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
//                         <span className="profile-label w-10">
//                           Year:
//                         </span>
//                         {vObj.contract !== undefined && (

//                           <span >{vObj.contract.typeOfOwnerShip}</span>
//                         )}
//                       </div>
//                       <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
//                         <span className="profile-label w-10">
//                           Duration Of Contract:
//                         </span>
//                         {vObj.contract !== undefined && (

//                           <span >{vObj.contract.durationOfContract}</span>
//                         )}
//                       </div>
//              </div>
//              <div className="row">
//                       <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
//                         <span className="profile-label w-8">
//                           Date Of Contract:
//                         </span>
//                         {vObj.contract !== undefined && (

//                           <span >{vObj.strStartDate}</span>
//                         )}
//                       </div>
//                       <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
//                         <span className="profile-label w-10">
//                           Contract Expiring Date:
//                         </span>
//                         {vObj.contract !== undefined && (

//                           <span >{vObj.strEndDate}</span>
//                         )}
//                       </div>
//              </div>
//              </div>
//                </div>
//                       </span>
//                     </TabPane>
//                     <TabPane tabId={2}>
//                       <span>
//                       <div className="p-2">
//                   <div className="details-container">
//                     <div className="row">
//                       <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
//                         <span className="profile-label w-8">
//                           Insurance Company:
//                         </span>
//                         {vObj.insurance !== undefined && (

//                           <span >{vObj.insurance.insuranceCompany}</span>
//                         )}
//                       </div>
//                       <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
//                         <span className="profile-label w-8">
//                           Type Of Insurance:
//                         </span>
//                         {vObj.insurance !== undefined && (

//                           <span >{vObj.insurance.typeOfInsurance}</span>
//                         )}
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
//                         <span className="profile-label w-8">
//                           Date Of Insurance:
//                         </span>
//                         {vObj.contract !== undefined && (

//                           <span >{vObj.strDateOfInsurance}</span>
//                         )}
//                       </div>
//                       <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
//                         <span className="profile-label w-10">
//                           Valid Till:
//                         </span>
//                         {vObj.contract !== undefined && (

//                           <span >{vObj.strValidTill}</span>
//                         )}
//                       </div>
//              </div>
//                   </div>
//                </div>

//                       </span> */}
//                     </TabPane>
//                   </TabContent>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       );
//     }
//   }
//   export default withApollo(VehicleDetailsPage);