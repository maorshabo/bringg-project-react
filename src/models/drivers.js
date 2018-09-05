import API from '../utils/API';
import locationParser from '../utils/parsers/locationParser';

class Drivers {
  constructor() {
    this.driversMap = {};
  }

  getAll() {
    return API.getDrivers()
      .then(drivers => drivers.map(Drivers.driverParser))
      .then(drivers => {
        this.driversMap = drivers.reduce((prev, current) => {
          prev[current._id] = current;
          return prev;
        }, {});
        return drivers;
      });
  }

  getDriversArray() {
    return Object.values(this.driversMap);
  }

  static driverParser(driver) {
    if (driver.location) {
      const driverName = `${driver.name.first} ${driver.name.last}`;
      return Object.assign({}, driver, { location: locationParser(driver.location), fullName: driverName });
    }
    return driver;
  }

  static mapDriversById(driversArray) {
    return driversArray.reduce((prev, current) => {
      prev[current._id] = current;
      return prev;
    }, {});
  }

  assignTask(taskId, driverId = '') {
    // find driver by task id
    const driver = Object.values(this.driversMap).find(d => (d.tasks || {}).hasOwnProperty(taskId));
    if (driverId.length > 0) {
      // init tasks object on the driver
      if (!this.driversMap[driverId].tasks) {
        this.driversMap[driverId].tasks = {};
      }
      // assign the task to the driver
      this.driversMap[driverId].tasks[taskId] = true;
      // assign the driver to the task
      if (driver && driver._id !== driverId) {
        this.driversMap[driver._id].tasks[taskId] = false;
      }
    }
    else {
      this.driversMap[driver._id].tasks[taskId] = false;
    }
    return this.getDriversArray();
  }

  filterDrivers(name = '', age) {
    if (name.length === 0 && (!age || age === 0)) {
      return Object.values(this.driversMap);
    }
    else {
      const driversArray = Object.values(this.driversMap);
      const loweredName = name.toLowerCase();
      return driversArray.filter(driver => {
        const fullName = driver.fullName.toLowerCase();
        const isNameMatched = fullName.indexOf(loweredName) > -1;

        if (loweredName.length > 0 && age > 0) {
          return isNameMatched && driver.age === age;
        }
        else if (name.length === 0 && age > 0) {
          return driver.age === age;
        }
        else {
          return isNameMatched;
        }
      });
    }
  }

  getAllDriversTasks(driversList) {
    const drivers = driversList || this.getDriversArray();
    return drivers
      .map(driver => Object.keys(driver.tasks || {}))
      .filter(arr => arr.length > 0)
      .reduce((prev, current) => {
        return prev.concat(current);
      }, [])
      .reduce((prev, current) => {
        prev[current] = true;
        return prev;
      }, {});
  }

  deleteDriver(driver) {
    if (driver && driver._id) {
      delete this.driversMap[driver._id];
      return this.getDriversArray();
    }
  }
}

export default Drivers;