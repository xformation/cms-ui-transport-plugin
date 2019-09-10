import * as React from 'react';
import { graphql, QueryProps, MutationFunc, compose } from 'react-apollo';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import * as Survey from "xform-react";
import "xform-react/xform.min.css";

import * as AddContractMutationGql from './_queries/AddContractMutation.graphql';
import * as AddDocumentMutationGql from './_queries/AddDocumentMutation.graphql';
import * as AddInsuranceMutationGql from './_queries/AddInsuranceMutation.graphql';
import * as AddVehicleMutationGql from './_queries/AddVehicleMutation.graphql';
// import { AdmissionServices } from './_services';
import {
    DocumentsAddMutationType,
    VehicleAddMutationType,
    ContractAddMutationType,
    InsuranceAddMutationType

} from '../../types';
import withLoadingHandler from '../../../components/withLoadingHandler';


type AddVehiclePageProps = RouteComponentProps & {
    addDocument: MutationFunc<DocumentsAddMutationType>;
    addVehicle: MutationFunc<VehicleAddMutationType>;
    addInsurance: MutationFunc<InsuranceAddMutationType>;
    addContract: MutationFunc<ContractAddMutationType>;
};

function onClickHeader(e: any) {
    const { currentTarget } = e;
    const plusSign = currentTarget.querySelector(".fa-plus");
    const minusSign = currentTarget.querySelector(".fa-minus");
    const collapseContainer = currentTarget.closest(".collapse-container");
    const formContainer = collapseContainer.querySelector(".gf-form-inline");
    const style = window.getComputedStyle(formContainer);
    if (style.display === "none") {
        formContainer.style.display = "grid";
        formContainer.style.gridGap = "10px";
        formContainer.style.gridTemplateColumns = "auto auto auto";
        minusSign.style.display = "block";
        plusSign.style.display = "none";
    } else {
        formContainer.style.display = "none";
        minusSign.style.display = "none";
        plusSign.style.display = "block";
    }
}

type AddVehiclePageStates = {
    vehicleData: any,
    submitted: any,
    fileName: any,
    activeRadio: any
};

const customCss = {
    root: "form-container",
    header: "form-header",
    headerError: "form-header-error",
    headerNoError: "form-header-success",
    footer: "panel-footer card-footer text-right",
    body: "form-body",
    question: {
        title: "form-control-label",
        mainRoot: "form-control-container sv_qstn"
    },
    text: "input-form-control",
    dropdown: {
        control: "select-form-control",
    },
    navigation: {
        complete: "btn bs d-none"
    },
    error: {
        root: "error"
    }
};

class AddVehiclePage extends React.Component<AddVehiclePageProps, AddVehiclePageStates>{
    isActive: any = false;
    totalResult: any;
    cumulativeResult: any;
    vehicleFormRef: any;
    contractFormRef: any;
    documentsFormRef: any;
    insuranceFormRef: any;
    constructor(props: AddVehiclePageProps) {
        super(props);
        this.state = {
            vehicleData: {
            },
            submitted: false,
            fileName: "",
            activeRadio: "draft"
        };
        this.reassignConfig();
      
        this.saveAllForm = this.saveAllForm.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.sendData = this.sendData.bind(this);
        this.vehicleFormRef = React.createRef();
        this.contractFormRef = React.createRef();
        this.documentsFormRef = React.createRef();
        this.insuranceFormRef = React.createRef();
    }

    handleRadioChange(e: any) {
        const { name, value } = e.target;
        this.isActive = value === "active";
        this.reassignConfig();
        this.setState({
            "activeRadio": value
        });
    }

    VEHICLE = {};
    CONTRACT = {};
    DOCUMENTS = {};
    INSURANCE = {};

    reassignConfig(){
        this.VEHICLE = {
            title: "Vehicle",
            showQuestionNumbers: "off",
            elements: [
                {
                    type: "text",
                    name: 'vehicleNumber',
                    title: 'Vehicle Number',
                    requiredErrorText: 'Please enter Vehicle Number',
                    isRequired: true,
                    startWithNewLine: false,
                },
                {
                    type: "text",
                    name: 'vehicleType',
                    title: 'Vehicle Type',
                    requiredErrorText: 'Please enter Vehicle Type',
                    isRequired: true,
                    startWithNewLine: false,
                },
                {
                    type: "text",
                    name: 'capacity',
                    title: 'Capacity',
                    requiredErrorText: 'Please enter capacity',
                    isRequired: true,
                    startWithNewLine: false,
                },
                {
                    type: "text",
                    name: 'ownerShip',
                    title: 'Ownership',
                    requiredErrorText: 'Please enter Ownership',
                    isRequired: true,
                    startWithNewLine: false,
                },
                {
                    type: "text",
                    inputType: "date",
                    name: 'dateOfRegistration',
                    title: 'Date Of Registration',
                    requiredErrorText: 'Please enter Date Of Registration',
                    isRequired: true,
                    startWithNewLine: false,
                },
                {
                    type: "text",
                    name: 'yearOfManufacturing',
                    title: 'Year Of Manufacturing',
                    requiredErrorText: 'Please enter Year Of Manufacturing',
                    isRequired: true,
                    startWithNewLine: false,
                },
                {
                    type: "text",
                    name: 'manufacturingCompany',
                    title: 'Manufacturing Company',
                    requiredErrorText: 'Please enter Manufacturing Company',
                    isRequired: true,
                    startWithNewLine: false,
                },
                {
                    type: "text",
                    name: 'model',
                    title: 'Model',
                    requiredErrorText: 'Please enter Model',
                    isRequired: true,
                    startWithNewLine: false,
                },
                {
                    type: "text",
                    name: 'contactNumber',
                    title: 'Contact Number',
                    requiredErrorText: 'Please enter Contact Number',
                    isRequired: true,
                    startWithNewLine: false,
                },
    
                {
                    type: "text",
                    name: 'rcNo',
                    title: 'RC Number',
                    requiredErrorText: 'Please enter RC Number',
                    isRequired: true,
                    startWithNewLine: false,
                },
                {
                    type: "text",
                    name: 'chasisNo',
                    title: 'Chasis Number',
                    requiredErrorText: 'Please enter Chasis Number',
                    isRequired: true,
                    startWithNewLine: false,
                },
            ]
        };

        this.CONTRACT = {
            title: "Contract Details",
            showQuestionNumbers: "off",
            elements: [
                {
                    type: 'text',
                    name: 'vendorName',
                    title: 'Vendor Name',
                    requiredErrorText: "Please enter Vendor Name",
                    isRequired: true,
                    startWithNewLine: false,
                },
                {
                    type: 'dropdown',
                    name: 'typeOfOwnership',
                    title: 'Type Of Ownership',
                    requiredErrorText: 'Please enter Type Of Ownership',
                    isRequired: this.isActive,
                    startWithNewLine: false,
                    choices: [
                        {
                            value: "COMPANYOWNED",
                            text: "COMPANYOWNED"
                        },
                        {
                            value: "CONTRACTUAL",
                            text: "CONTRACTUAL"
                        }
                    ]
                },
                {
                type: "text",
                inputType: "date",
                name: 'startDate',
                title: 'Start Date',
                requiredErrorText: 'Please enter Start Date',
                isRequired: true,
                startWithNewLine: false,
                },
                {
                    type: "text",
                    inputType: "date",
                    name: 'endDate',
                    title: 'End Date',
                    requiredErrorText: 'Please enter End Date',
                    isRequired: true,
                    startWithNewLine: false,
                }     
            ]
        };
    
        this.DOCUMENTS = {
            title: "Documents",
            showQuestionNumbers: "off",
            elements: [
                {
                    type: 'text',
                    name: 'documentName',
                    title: 'Document Name',
                    isRequired: this.isActive,
                    requiredErrorText: 'Please enter Document Name',
                    startWithNewLine: false,
                },
                {
                    type: 'text',
                    name: 'documentFilePath',
                    title: 'Upload',
                    isRequired: this.isActive,
                    requiredErrorText: 'Please enter Upload',
                    startWithNewLine: false,
                },
            ]
        };

        this.INSURANCE = {
            title: "",
            showQuestionNumbers: "off",
            elements: [
                {
                    type: 'text',
                    name: 'insuranceCompany',
                    title: 'Insurance Company',
                    requiredErrorText: "Please enter Insurance Company",
                    isRequired: true,
                    startWithNewLine: false,
                },
                {
                    type: 'dropdown',
                    name: 'typeOfInsurance',
                    title: 'Type Of Insurance',
                    requiredErrorText: 'Please enter Type Of Insurance',
                    isRequired: this.isActive,
                    startWithNewLine: false,
                    choices: [
                        {
                            value: "LIABILITY",
                            text: "LIABILITY"
                        },
                        {
                            value: "COLLISION",
                            text: "COLLISION"
                        },
                        {
                            value: "COMPREHENSIVE",
                            text: "COMPREHENSIVE"
                        }
                    ]
                },
                {
                type: "text",
                inputType: "date",
                name: 'dateOfInsurance',
                title: 'Date Of Insurance',
                requiredErrorText: 'Please enter Date Of Insurance',
                isRequired: true,
                startWithNewLine: false,
                },
                {
                    type: "text",
                    inputType: "date",
                    name: 'validTill',
                    title: 'Valid Till',
                    requiredErrorText: 'Please enter Validity',
                    isRequired: true,
                    startWithNewLine: false,
                }     
            ]
        };
    }

    onCompleteVehicleForm(result:any){
        result.clear(false, true);
        this.totalResult += 1;
        this.cumulativeResult = {
            ...this.cumulativeResult,
            ...result.data
        };
        if (this.totalResult === 3) {
            this.sendData();
        }
    }

    onCompleteContractForm(result:any){
        result.clear(false, true);
        this.totalResult += 1;
        this.cumulativeResult = {
            ...this.cumulativeResult,
            ...result.data
        };
        if (this.totalResult === 3) {
            this.sendContractData();
        }
    }

    onCompleteInsuranceForm(result:any){
        result.clear(false, true);
        this.totalResult += 1;
        this.cumulativeResult = {
            ...this.cumulativeResult,
            ...result.data
        };
        if (this.totalResult === 3) {
            this.sendInsuranceData();
        }
    }

    sendData(){
        const { addVehicle } = this.props;
        return addVehicle({
            variables: { input: {
                    ...this.cumulativeResult
                }
            },
        }).then((data: any) => {
            console.log("success"); 
        }).catch((error: any) => {
            console.log("failure");
        });
    }

    sendContractData(){
        const { addContract } = this.props;
        return addContract({
            variables: { input: {
                    ...this.cumulativeResult
                }
            },
        }).then((data: any) => {
            console.log("success"); 
        }).catch((error: any) => {
            console.log("failure");
        });
    }

    sendInsuranceData(){
        const { addInsurance } = this.props;
        return addInsurance({
            variables: { input: {
                    ...this.cumulativeResult
                }
            },
        }).then((data: any) => {
            console.log("success"); 
        }).catch((error: any) => {
            console.log("failure");
        });
    }

    saveAllForm() {
        this.totalResult = 0;
        this.cumulativeResult = {};
        this.vehicleFormRef.current.survey.completeLastPage();
        this.contractFormRef.current.survey.completeLastPage();
        this.insuranceFormRef.current.survey.completeLastPage();
    }

    render() {
        return (
            <section className="xform-container">
                <div className="student-profile-container">
                    <div className="row m-0">
                        <div className="col-sm-12 col-xs-12 profile-header m-b-2">
                            <div className="pull-left">Admin - Add Vehicle</div>
                            
                            <div className="pull-right">
                                <span className="m-r-2 data-saved-message" style={{ fontSize: "13px", color: "#AA0000", display: "none" }}>Data Saved</span>
                                <button className="btn bs" type="submit" onClick={this.saveAllForm}>Save</button>
                            </div>
                        </div>
                    </div>
                        <div className="col-lg-9 col-md-12 col-sm-12 col-xs-12 right-part custom-style">
                            <div>
                            <Survey.SurveyCollapseForm json={this.VEHICLE} css={customCss} onComplete={this.onCompleteVehicleForm} ref={this.vehicleFormRef} />
                            </div>
                            <div>
                            </div>
                            <div>
                                <Survey.SurveyCollapseForm json={this.CONTRACT} css={customCss}  onComplete={this.onCompleteContractForm} ref={this.contractFormRef} />
                            </div>
                            <div>
                                <Survey.SurveyCollapseForm json={this.INSURANCE} css={customCss}  onComplete={this.onCompleteInsuranceForm} ref={this.insuranceFormRef} />
                            </div>
                            <div>
                                <Survey.SurveyCollapseForm json={this.DOCUMENTS} css={customCss} showCompletedPage={false} ref={this.documentsFormRef} />
                            </div>
                        </div>
                    </div>
            </section>
        );
    }
}

export default withLoadingHandler(

    compose(
        graphql<DocumentsAddMutationType, AddVehiclePageProps>(AddDocumentMutationGql, {
            name: "addDocument",
        }),
        graphql<VehicleAddMutationType, AddVehiclePageProps>(AddVehicleMutationGql, {
            name: "addVehicle"
        }),
        graphql<ContractAddMutationType, AddVehiclePageProps>(AddContractMutationGql, {
            name: "addContract"
        }),
        graphql<InsuranceAddMutationType, AddVehiclePageProps>(AddInsuranceMutationGql, {
            name: "addInsurance"
        })
    )

        (AddVehiclePage) as any
);