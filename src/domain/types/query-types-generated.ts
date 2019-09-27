import {number} from 'prop-types';
import {any} from 'async';

/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type VehicleListQuery = {
  getVehicleList: Array<{
    id: number;
    vehicleNumber: number;
    vehicleType: string;
    capacity: number;
    ownerShip: string;
    dateOfRegistration: any;
    strDateOfRegistration: string;
    yearOfManufacturing: string;
    model: string;
    manufacturingCompany: string;
    chasisNo: string;
    rcNo: string;
    contactNumber: string;
    status: string;
    transportRoute: {
      routeName: any;
    };
    insurance: {
      validTill: any;
    };
    strDateOfInsurance: string;
    strValidTill: string;
    strStartDate: string;
    strEndDate: string;
  }>;
};

export type VehicleQueryVariables = {
  vehicleId: number;
};

export type VehicleQuery = {
  vehicle: {
    id: number;
    vehicleNumber: number;
    vehicleType: string;
    capacity: number;
    ownerShip: string;
    dateOfRegistration: any;
    strDateOfRegistration: string;
    yearOfManufacturing: string;
    manufacturingCompany: string;
    model: string;
    chasisNo: string;
    rcNo: string;
    contactNumber: string;
    status: string;
    employee: {
      id: any;
    };
    transportRoute: {
      id: any;
    };
    insurance: {
      id: number;
      insuranceCompany: string;
      typeOfInsurance: string;
      dateOfInsurance: string;
      validTill: string;
    };
    contract: {
      id: number;
      vendorName: string;
      typeOfOwnerShip: string;
      durationOfContract: string;
    };
    strDateOfInsurance: string;
    strValidTill: string;
    strStartDate: string;
    strEndDate: string;
  };
};

export type VehicleFragment = {
  id: number;
  vehicleNumber: number;
  vehicleType: string;
  capacity: number;
  ownerShip: string;
  dateOfRegistration: any;
  strDateOfRegistration: string;
  yearOfManufacturing: string;
  manufacturingCompany: string;
  model: string;
  chasisNo: string;
  rcNo: string;
  contactNumber: string;
  status: string;
  employee: {
    id: any;
  };
  transportRoute: {
    id: any;
  };
  insurance: {
    id: number;
    insuranceCompany: string;
    typeOfInsurance: string;
    dateOfInsurance: string;
    validTill: string;
  };
  contract: {
    id: number;
    vendorName: string;
    typeOfOwnerShip: string;
    durationOfContract: string;
  };
  strDateOfInsurance: string;
  strValidTill: string;
  strStartDate: string;
  strEndDate: string;
};

export type VehicleDetailsFragment = {
  id: number;
  vehicleNumber: number;
  vehicleType: string;
  capacity: number;
  ownerShip: string;
  dateOfRegistration: any;
  strDateOfRegistration: string;
  yearOfManufacturing: string;
  manufacturingCompany: string;
  model: string;
  chasisNo: string;
  rcNo: string;
  contactNumber: string;
  status: string;
  employee: {
    id: any;
  };
  transportRoute: {
    id: any;
  };
  insurance: {
    id: number;
    insuranceCompany: string;
    typeOfInsurance: string;
    dateOfInsurance: string;
    validTill: string;
  };
  contract: {
    id: number;
    vendorName: string;
    typeOfOwnerShip: string;
    durationOfContract: string;
  };
  strDateOfInsurance: string;
  strValidTill: string;
  strStartDate: string;
  strEndDate: string;
};

export type VehicleSummaryFragment = {
  id: number;
  vehicleNumber: number;
  vehicleType: string;
  capacity: number;
  ownerShip: string;
  dateOfRegistration: string;
  yearOfManufacturing: string;
  manufacturingCompany: string;
  model: string;
  chasisNo: string;
  rcNo: string;
  contactNumber: string;
  status: string;
  employee: {
    id: any;
  };
  transportRoute: {
    id: any;
  };
  insurance: {
    id: number;
    insuranceCompany: string;
    typeOfInsurance: string;
    dateOfInsurance: string;
    validTill: string;
  };
  contract: {
    id: number;
    vendorName: string;
    typeOfOwnerShip: string;
    durationOfContract: string;
  };
  strDateOfInsurance: string;
  strValidTill: string;
  strStartDate: string;
  strEndDate: string;
};

export type LoadVehicleFilterDataCacheType = {
  createVehicleDataCache: {
    vehicles: Array<{
      id: number;
    }>;
    transportRoutes: Array<{
      id: number;
    }>;
  };
};

export type DriverListQuery = {
  getEmployeeList: Array<{
    id: number;
    employeeName: string;
    designation: string;
    joiningDate: string;
    jobEndDate: string;
    resignationDate: string;
    resignationAcceptanceDate: string;
    aadharNo: string;
    panNo: string;
    passportNo: string;
    primaryContactNo: string;
    secondaryContactNo: string;
    employeeFatherName: string;
    employeeMotherName: string;
    primaryAddress: string;
    secondaryAddress: string;
    employeeAddress: string;
    personalMailId: string;
    officialMailId: string;
    disability: string;
    drivingLicenceNo: string;
    drivingLicenceValidity: string;
    gender: string;
    typeOfEmployment: string;
    managerId: number;
    status: string;
    maritalStatus: string;
    strjoiningDate: string;
    strjobEndDate: string;
    strresignationDate: string;
    strresignationAcceptanceDate: string;
    strdrivingLicenceValidity: string;
    transportRoute: {
      routeName: any;
    };
    branch: {
      id: any;
    };
    vehicle: {
      vehicleNumber: any;
    };
  }>;
};

export type DriverQueryVariables = {
  employeeId: number;
};

export type DriverQuery = {
  employee: {
    id: number;
    employeeName: string;
    designation: string;
    joiningDate: string;
    jobEndDate: string;
    resignationDate: string;
    resignationAcceptanceDate: string;
    aadharNo: string;
    panNo: string;
    passportNo: string;
    primaryContactNo: string;
    secondaryContactNo: string;
    employeeFatherName: string;
    employeeMotherName: string;
    primaryAddress: string;
    secondaryAddress: string;
    employeeAddress: string;
    personalMailId: string;
    officialMailId: string;
    disability: string;
    drivingLicenceNo: string;
    drivingLicenceValidity: string;
    gender: string;
    typeOfEmployment: string;
    managerId: number;
    status: string;
    maritalStatus: string;
    strjoiningDate: string;
    strjobEndDate: string;
    strresignationDate: string;
    strresignationAcceptanceDate: string;
    strdrivingLicenceValidity: string;
    transportRoute: {
      routeName: any;
    };
    branch: {
      id: any;
    };
    vehicle: {
      vehicleNumber: any;
    };
  };
};

export type DriverFragment = {
  id: number;
  employeeName: string;
  designation: string;
  joiningDate: string;
  jobEndDate: string;
  resignationDate: string;
  resignationAcceptanceDate: string;
  aadharNo: string;
  panNo: string;
  passportNo: string;
  primaryContactNo: string;
  secondaryContactNo: string;
  employeeFatherName: string;
  employeeMotherName: string;
  primaryAddress: string;
  secondaryAddress: string;
  employeeAddress: string;
  personalMailId: string;
  officialMailId: string;
  disability: string;
  drivingLicenceNo: string;
  drivingLicenceValidity: string;
  gender: string;
  typeOfEmployment: string;
  managerId: number;
  status: string;
  maritalStatus: string;
  strjoiningDate: string;
  strjobEndDate: string;
  strresignationDate: string;
  strresignationAcceptanceDate: string;
  strdrivingLicenceValidity: string;
  transportRoute: {
    routeName: any;
  };
  branch: {
    id: any;
  };
  vehicle: {
    vehicleNumber: any;
  };
};

export type DriverDetailsFragment = {
  id: number;
  employeeName: string;
  designation: string;
  joiningDate: string;
  jobEndDate: string;
  resignationDate: string;
  resignationAcceptanceDate: string;
  aadharNo: string;
  panNo: string;
  passportNo: string;
  primaryContactNo: string;
  secondaryContactNo: string;
  employeeFatherName: string;
  employeeMotherName: string;
  primaryAddress: string;
  secondaryAddress: string;
  employeeAddress: string;
  personalMailId: string;
  officialMailId: string;
  disability: string;
  drivingLicenceNo: string;
  drivingLicenceValidity: string;
  gender: string;
  typeOfEmployment: string;
  managerId: number;
  status: string;
  maritalStatus: string;
  strjoiningDate: string;
  strjobEndDate: string;
  strresignationDate: string;
  strresignationAcceptanceDate: string;
  strdrivingLicenceValidity: string;
  transportRoute: {
    routeName: any;
  };
  branch: {
    id: any;
  };
  vehicle: {
    vehicleNumber: any;
  };
};

export type DriverSummaryFragment = {
  id: number;
  employeeName: string;
  designation: string;
  joiningDate: string;
  jobEndDate: string;
  resignationDate: string;
  resignationAcceptanceDate: string;
  aadharNo: string;
  panNo: string;
  passportNo: string;
  primaryContactNo: string;
  secondaryContactNo: string;
  employeeFatherName: string;
  employeeMotherName: string;
  primaryAddress: string;
  secondaryAddress: string;
  employeeAddress: string;
  personalMailId: string;
  officialMailId: string;
  disability: string;
  drivingLicenceNo: string;
  drivingLicenceValidity: string;
  gender: string;
  typeOfEmployment: string;
  managerId: number;
  status: string;
  maritalStatus: string;
  strjoiningDate: string;
  strjobEndDate: string;
  strresignationDate: string;
  strresignationAcceptanceDate: string;
  strdrivingLicenceValidity: string;
  transportRoute: {
    routeName: any;
  };
  branch: {
    id: any;
  };
  vehicle: {
    vehicleNumber: any;
  };
};

export type LoadDriverFilterDataCacheType = {
  createEmployeeDataCache: {
    employees: Array<{
      id: number;
      vehicle: {
        id: any;
        vehicleNumber: any;
      };
    }>;
    vehicles: Array<{
      id: number;
    }>;
  };
};

export type LoadAddVehicleDataCacheType = {
  createAddVehicleDataCache: {
    colleges: Array<{
      id: number;
      shortName: string;
    }>;
    branches: Array<{
      id: number;
      branchName: string;
      college: {
        id: number;
      };
      state: {
        id: number;
      };
      city: {
        id: number;
      };
    }>;
  };
};

export type AddDocumentsInput = {
  id?: number | null;
  documentName?: string | null;
  documentFilePath?: string | null;
};

export type AddDocumentMutationVariables = {
  input: AddDocumentsInput;
};

export type DocumentsAddMutationType = {
  addDocuments: {
    documents: {
      id: number;
      documentName: string;
      documentFilePath: string;
    };
  };
};

export type AddVehicleInput = {
  id?: number | null;
  vehicleNumber?: number | null;
  vehicleType?: string | null;
  capacity?: number | null;
  ownerShip?: string | null;
  dateOfRegistration?: string | null;
  yearOfManufacturing?: string | null;
  manufacturingCompany?: string | null;
  model?: string | null;
  chasisNo?: string | null;
  rcNo?: string | null;
  contactNumber?: string | null;
  status?: string | null;
  employee: {
    id?: any | null;
  };
  transportRoute: {
    id?: any | null;
  };
  insurance: {
    id?: any | null;
  };
  contract: {
    id?: any | null;
  };
};

export type AddVehicleMutationVariables = {
  input: AddVehicleInput;
};

export type VehicleAddMutationType = {
  addVehicle: {
    vehicle: {
      id: number;
      vehicleNumber: number;
      vehicleType: string;
      capacity: number;
      ownerShip: string;
      dateOfRegistration: string;
      yearOfManufacturing: string;
      manufacturingCompany: string;
      model: string;
      chasisNo: string;
      rcNo: string;
      contactNumber: string;
      status: string;
      employee: {
        id: any;
      };
      transportRoute: {
        id: any;
      };
      insurance: {
        id: any;
      };
      contract: {
        id: any;
      };
    };
  };
};

export type AddInsuranceInput = {
  id?: number | null;
  insuranceCompany?: string | null;
  typeOfInsurance?: string | null;
  dateOfInsurance?: string | null;
  validTill?: string | null;
  strDateOfInsurance?: string | null;
  strValidTill?: string | null;
};

export type AddInsuranceMutationVariables = {
  input: AddInsuranceInput;
};

export type InsuranceAddMutationType = {
  addInsurance: {
    id: number;
    insuranceCompany: string;
    typeOfInsurance: string;
    dateOfInsurance: string;
    validTill: string;
    strDateOfInsurance: string;
    strValidTill: string;
  };
};

export type AddContractInput = {
  id?: number | null;
  vendorName?: string | null;
  typeOfOwnerShip?: string | null;
  durationOfContract?: string | null;
  startDate?: string | null;
  endDate?: string | null;
};

export type AddContractMutationVariables = {
  input: AddContractInput;
};

export type ContractAddMutationType = {
  addContract: {
    contract: {
      id: number;
      vendorName: string;
      typeOfOwnerShip: string;
      durationOfContract: string;
      startDate: string;
      endDate: string;
    };
  };
};

/* tslint:enable */
