import locationParser from './locationParser';

function driverParser(driver) {
  if (driver.location) {
    const driverName = `${driver.name.first} ${driver.name.last}`;
    return Object.assign({}, driver, { location: locationParser(driver.location), fullName: driverName });
  }
  return driver;
}

function taskParser(task = {}) {
  if (task.location) {
    return Object.assign({}, task, { location: locationParser(task.location), isShown: true });
  }
  return task;
}

export { driverParser, taskParser };