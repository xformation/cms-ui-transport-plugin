import * as React from 'react';
// import { graphql, QueryProps, MutationFunc, compose } from 'react-apollo';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
;

import {  FaBus } from 'react-icons/fa';
import '../../../css/tabs.css';
import '../../../css/college-settings.css'
import AddVehiclePage from '../AddVehiclePage';
import AddTransportRoutePage from '../AddTransportRoutePage';


export default class FeesTab extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      activeTab: 0,
    };
    this.toggleTab = this.toggleTab.bind(this);
  }

  toggleTab(tabNo: any) {
    this.setState({
      activeTab: tabNo,
    });
  }

  render() {
    const { activeTab } = this.state;
    return (
      <section className="tab-container">
         <div className="">
          {/* <img src="../../img/students.png" alt="" /> */}
          {/* <h5><FaBus className="fa-2x" /> Transport</h5> */}
          {/* <h5 className="p-1">Transport</h5> */}
        {/* </div>  */}
         <h5>
         <i className="fa fa-bus mr-5" aria-hidden="true" />{' '}
          Transport
       </h5>
       </div>
        <Nav tabs className="pl-3 pl-3 mb-4 mt-4 boxShadow">
          <NavItem className="cursor-pointer">
            <NavLink
              className={`${activeTab === 0 ? 'active' : ''}`}
              onClick={() => {
                this.toggleTab(0);
              }}
            >
               Vehicle page
            </NavLink>
          </NavItem>
          <NavItem className="cursor-pointer">
            <NavLink
              className={`${activeTab === 1 ? 'active' : ''}`}
              onClick={() => {
                this.toggleTab(1);
              }}
            >
              Transport Page
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab} className="border-right">
          <TabPane tabId={0}>
            <AddVehiclePage />
          </TabPane>
          <TabPane tabId={1}>
             <AddTransportRoutePage />
          </TabPane>
        </TabContent>
      </section>
    );
  }
}