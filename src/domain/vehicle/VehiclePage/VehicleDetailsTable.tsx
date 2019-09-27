import * as React from 'react';
import { VehicleFragment } from '../../types';

import { Link } from 'react-router-dom';

class Tabs extends React.Component<{}, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      active: 0
    }
  }

  select = (i: any) => {
    let _this = this;
    return function () {
      _this.setState({
        active: i
      });
    }
  }

  renderTabs = () => {
    return React.Children.map(this.props.children, (item, i) => {
      if (i % 2 === 0) {
        let active = this.state.active === i ? 'active' : '';
        return <a onClick={this.select(i)} className={`${active} tab`}>{item}</a>;
      }
    });
  }

  renderContent() {
    return React.Children.map(this.props.children, (item, i) => {
      if (i - 1 === this.state.active) {
        return <div className='content'>{item}</div>;
      } else {
        return;
      }
    });
  }

  render() {
    return (
      <div className="tabsAdmission">
          {this.renderTabs()}
        
        {this.renderContent()}
      </div>
    );
  }
}

export default ({ vehicle }: { vehicle: VehicleFragment }) => (
  <section className="border">
    <h3 className="bg-heading p-1 m-b-0">
      <i className="fa fa-university stroke-transparent mr-1" aria-hidden="true" />{' '}
      Transport Management
    </h3>
      <div className="col-sm-4 col-xs-12 m-b-1">
                  <span className="profile-label">Vehicle No: </span>
                  <span>{vehicle.vehicleNumber}</span>
                </div>
                <div className="col-sm-4 col-xs-12 m-b-1">
                  <span className="profile-label">Status: </span>
                  <span>{vehicle.status}</span>
                </div>
        <div className="row">
          <div className="col-md-2 buttons-container dont-print mt--12">
          <h5 className="bg-grey head-prime text-uppercase p--512">Vehicle Id :<span className="dark-text">
            { vehicle.id }</span></h5>
            <div className="btn-group btn-adm m-4">
              <button className="btn btn-primary disabled">Approve</button>
              <button className="btn btn-primary disabled">Followup</button>
              <button className="btn btn-primary disabled">Decline</button>
              <button className="btn btn-primary disabled">Edit</button>
              <button className="btn btn-primary disabled">Print</button>
              <button className="btn btn-primary disabled">Back</button>
            </div>
          </div>
              <div className="col-md-10">
            <Tabs>
              Vehicle Details
              <span>
                <div className="p-2">
                  <div className="details-container">
                    <div className="row">
                      <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
                        <span className="profile-label w-8">
                          Vehicle No:
                        </span>
                        <span className="">{vehicle.vehicleNumber}</span>
                      </div>
                      <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
                        <span className="profile-label w-12">
                          Vehicle Type:
                        </span>
                        <span className="">{vehicle.vehicleType}</span>
                      </div>
                      <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
                        <span className="profile-label w-10">
                          Date Of Registration: </span>
                        <span className="">{vehicle.strDateOfRegistration}</span>

                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
                        <span className="profile-label w-8">
                          Rc No:</span>
                        <span className="">{vehicle.rcNo}</span>
                      </div>
                      <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
                        <span className="profile-label w-12">
                          Year Of Manufacturing:</span>
                        <span className="">{vehicle.yearOfManufacturing}</span>
                      </div>
                      <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
                        <span className="profile-label w-10">
                          Chasis No:</span>
                        <span className="">{vehicle.chasisNo}</span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
                        <span className="profile-label w-8">
                          Capacity: </span>
                        <span className="">{vehicle.capacity}</span>
                      </div>
                      <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
                        <span className="profile-label w-12">
                          Manufacturing Company: </span>
                        <span className="">{vehicle.manufacturingCompany}</span>
                      </div>
                      <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
                        <span className="profile-label w-10">
                          Ownership: </span>
                        <span className="">{vehicle.ownerShip}</span>
                      </div>
                    </div>
                  </div>
                  <div className="details-container">
                    <div className="row">
                      <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
                        <span className="profile-label w-8">
                         Model: </span>
                        <span className="">{vehicle.model}</span>
                      </div>
                      <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
                        <span className="profile-label w-12">
                          Contact Number:
                      </span>
                        <span className="">{vehicle.contactNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </span>

              Contract Details

              <div className="p-2">
                  <div className="details-container">
                    <div className="row">
                      <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
                        <span className="profile-label w-8">
                          Vendor Name:
                        </span>
                        {vehicle.contract !== undefined && (

                          <span >{vehicle.contract.vendorName}</span>
                        )}
                      </div>
                      <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
                        <span className="profile-label w-10">
                          Year:
                        </span>
                        {vehicle.contract !== undefined && (

                          <span >{vehicle.contract.typeOfOwnerShip}</span>
                        )}
                      </div>
                      <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
                        <span className="profile-label w-10">
                          Duration Of Contract:
                        </span>
                        {vehicle.contract !== undefined && (

                          <span >{vehicle.contract.durationOfContract}</span>
                        )}
                      </div>
             </div>
             <div className="row">
                      <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
                        <span className="profile-label w-8">
                          Date Of Contract:
                        </span>
                        {vehicle.contract !== undefined && (

                          <span >{vehicle.strStartDate}</span>
                        )}
                      </div>
                      <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
                        <span className="profile-label w-10">
                          Contract Expiring Date:
                        </span>
                        {vehicle.contract !== undefined && (

                          <span >{vehicle.strEndDate}</span>
                        )}
                      </div>
             </div>
             </div>
               </div>
               Insurance Details
              <div className="p-2">
                  <div className="details-container">
                    <div className="row">
                      <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
                        <span className="profile-label w-8">
                          Insurance Company:
                        </span>
                        {vehicle.insurance !== undefined && (

                          <span >{vehicle.insurance.insuranceCompany}</span>
                        )}
                      </div>
                      <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
                        <span className="profile-label w-8">
                          Type Of Insurance:
                        </span>
                        {vehicle.insurance !== undefined && (

                          <span >{vehicle.insurance.typeOfInsurance}</span>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
                        <span className="profile-label w-8">
                          Date Of Insurance:
                        </span>
                        {vehicle.contract !== undefined && (

                          <span >{vehicle.strDateOfInsurance}</span>
                        )}
                      </div>
                      <div className="col-sm-4 col-xs-12 m-b-1 adminDetails">
                        <span className="profile-label w-10">
                          Valid Till:
                        </span>
                        {vehicle.contract !== undefined && (

                          <span >{vehicle.strValidTill}</span>
                        )}
                      </div>
             </div>
                  </div>
               </div>

              Documents

              <div><p className="h2">In Progress</p></div>

            </Tabs>
          </div>
          </div>
          
  </section >
);