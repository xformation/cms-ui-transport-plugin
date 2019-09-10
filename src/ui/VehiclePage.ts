import init from '../domain/vehicle/VehicleListPage/VehicleApp';

export class VehiclePage {
    static templateUrl = '/partials/vehicle.html';
    constructor() {
        init();
    }
}