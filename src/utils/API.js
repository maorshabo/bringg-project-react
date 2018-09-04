import { driverParser, taskParser } from './parsers';

class API {
  static getDrivers() {
    return fetch('https://next.json-generator.com/api/json/get/Ny8G4KT7H').then(res => res.json()).then(drivers => drivers.map(driverParser))
  }

  static getTasks() {
    return fetch('https://next.json-generator.com/api/json/get/Vk8YSY6QB').then(res => res.json()).then(drivers => drivers.map(taskParser));
  }
}

export default API;