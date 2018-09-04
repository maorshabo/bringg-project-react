import locationParser from './locationParser';

function driverParser(driver) {
  if (driver.location) {
    return Object.assign({}, driver, { location: locationParser(driver.location) });
  }
  return driver;
}

function taskParser(task = {}) {
  if (task.location) {
    return Object.assign({}, task, { location: locationParser(task.location) });
  }
  return task;
}

export { driverParser, taskParser };