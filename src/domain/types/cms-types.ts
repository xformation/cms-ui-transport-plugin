// ------------------------------------ REACT ------------------------------------
export type ReactFunctionOrComponentClass<P> =
  | React.ComponentClass<P>
  | React.StatelessComponent<P>;

// --------------------------------------

export type VehicleData = {
  // id: string;
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
