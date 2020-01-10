import * as React from 'react';
// import { graphql, QueryProps, MutationFunc, compose } from 'react-apollo';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';

// import '../../../css/tabs.css'
import '../../../css/college-settings.css';
import VehicleListPage from './VehicleListPage';
import DriverListPage from '../DriverListPage/DriverListPage';
// import { CollegeInfo } from './CollegeInfo';
// import {CollegeBranches} from './CollegeBranches';

export default class vehicle extends React.Component<any, any> {
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
            <section className="tab-container row vertical-tab-container">
                <Nav tabs className="pl-3 pl-3 mb-4 mt-4 col-sm-2">
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 0 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(0); }} >
                        Vehicle Page
                        </NavLink>
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 1 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(1); }} >
                           Driver Page
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={activeTab} className="col-sm-9 border-left p-t-1">
                    <TabPane tabId={0}>
                        <VehicleListPage/>
                    </TabPane>
                    <TabPane tabId={1}>
                        <DriverListPage/>
                    </TabPane>
                </TabContent>
            </section>
        );
    }
}