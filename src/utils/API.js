class API {
  static getDrivers() {
    return fetch('https://next.json-generator.com/api/json/get/Ny8G4KT7H').then(res => res.json());
  }

  static getTasks() {
    return fetch('https://next.json-generator.com/api/json/get/Vk8YSY6QB').then(res => res.json());
  }
}

export default API;