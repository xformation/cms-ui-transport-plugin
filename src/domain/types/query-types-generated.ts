import { number } from "prop-types";

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
      id: any;
    };
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
      id: any;
    };
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
    id: any;
  };
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
      id: any;
    };
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
  employee:{
    id?: any | null;
  }
  transportRoute:{
    id?: any | null;
  }
  insurance:{
    id?: any | null;
  };
  contract:{
    id?: any | null;
  }
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
      employee:{
        id: any;
      }
      transportRoute:{
        id: any;
      }
      insurance:{
        id: any;
      };
      contract:{
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
