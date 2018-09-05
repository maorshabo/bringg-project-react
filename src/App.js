import React, { Component } from 'react';
import './App.css';
import Filters from './components/filters/Filters';
import DriversList from './components/driversList/DriversList';
import Map from './components/map/Map';
import Tasks from './components/tasks/Tasks';
import API from './utils/API';

const initialSort = {
  fullName: 0,
  age: 0,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      driversList: {},
      filteredDriversList: [],
      tasksList: [],
      driversSort: initialSort,
      filters: {
        name: '',
        age: undefined
      },
      mapCenter: { lat: -34.397, lng: 150.644 }
    }
  }

  mapDriversById = (driversArray) => {
    return driversArray.reduce((prev, current) => {
      prev[current._id] = current;
      return prev;
    }, {});
  };

  componentDidMount() {
    Promise.all([API.getDrivers(), API.getTasks()])
      .then(responses => {
        this.setState({
          driversList: this.mapDriversById(responses[0]),
          tasksList: responses[1],
          filteredDriversList: responses[0]
        })
      })
      .catch(console.error)
  }

  onDeleteDriver = (driver) => {
    if (driver && driver._id) {
      const { driversList } = this.state;
      delete driversList[driver._id];
      this.setState({ driversList }, () => {
        this.filterDrivers(this.state.filters.name, this.state.filters.age);
      });
    }
  };

  setMapCenter(lat, lng) {
    this.setState({ mapCenter: { lat, lng } });
  }

  onAssignTask = (taskId, driverId = '') => {
    const { driversList, tasksList } = this.state;

    // find driver by task id
    const driver = Object.values(driversList).find(d => (d.tasks || {}).hasOwnProperty(taskId));
    const taskIdx = tasksList.findIndex(t => t._id === taskId);

    if (driverId.length > 0) {
      // init tasks object on the driver
      if (!driversList[driverId].tasks) {
        driversList[driverId].tasks = {};
      }
      // assign the task to the driver
      driversList[driverId].tasks[taskId] = true;
      // assign the driver to the task
      tasksList[taskIdx].driverId = driverId;
      if (driver && driver._id !== driverId) {
        driversList[driver._id].tasks[taskId] = false;
      }
    }
    else {
      driversList[driver._id].tasks[taskId] = false;
      tasksList[taskIdx].driverId = undefined;
    }
    this.setState({ driversList, tasksList }, () => {
      this.filterDrivers(this.state.filters.name, this.state.filters.age);
    });
  };

  sortDrivers = (driversList, sortStatus) => {
    let { driversSort, filteredDriversList } = this.state;

    const currentDriversSort = sortStatus ? sortStatus : driversSort;
    const sortKey = Object.keys(currentDriversSort).find(s => currentDriversSort[s] !== 0);
    const listToSort = Array.isArray(driversList) ? driversList : filteredDriversList;
    const sortedDrivers = listToSort.sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return -1 * currentDriversSort[sortKey];
      else if (a[sortKey] > b[sortKey]) return 1 * currentDriversSort[sortKey];
      else return 0;
    });
    return Array.from(sortedDrivers);
  };

  onSortByField = (byField) => {
    let { driversSort } = this.state;
    const oldSortValue = driversSort[byField];
    driversSort = Object.assign({}, initialSort);
    if (oldSortValue === 0) {
      driversSort[byField] = 1;
    }
    else {
      driversSort[byField] = oldSortValue * -1;
    }
    const filteredDriversList = this.sortDrivers(this.state.filteredDriversList, driversSort);
    this.setState({ filteredDriversList, driversSort });
  };

  filterDrivers = (name = '', age) => {
    if (name.length === 0 && (!age || age === 0)) {
      this.setState({
        filteredDriversList: this.sortDrivers(Object.values(this.state.driversList)),
        filters: {
          name,
          age
        }
      });
    }
    else {
      const driversArray = Object.values(this.state.driversList);
      const loweredName = name.toLowerCase();
      const filteredDriversList = driversArray.filter(driver => {
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
      this.setState({
        filteredDriversList: this.sortDrivers(filteredDriversList),
        filters: {
          name,
          age
        }
      });
    }
  };

  locateTask = (task = {}) => {
    if (task.location) {
      // update tasksList
      const { tasksList } = this.state;
      const taskIdx = tasksList.findIndex(t => t._id === task._id);
      tasksList[taskIdx] = Object.assign({}, tasksList[taskIdx], task);
      this.setMapCenter(task.location.latitude, task.location.longitude);
      this.setState({ tasksList });
    }
  };

  locateDriver = (driver = {}) => {
    if (driver.location) {
      this.setMapCenter(driver.location.latitude, driver.location.longitude);
    }
  };

  getFilteredTasks = (driversList) => {
    const tasksIds = driversList
      .map(driver => Object.keys(driver.tasks || {}))
      .filter(arr => arr.length > 0)
      .reduce((prev, current) => {
        return prev.concat(current);
      }, [])
      .reduce((prev, current) => {
        prev[current] = true;
        return prev;
      }, {});
    return tasksIds;
  };

  render() {
    const { filteredDriversList, tasksList, driversList, mapCenter, filters, driversSort } = this.state;
    const driversArray = Object.values(driversList);
    let filteredTasks = tasksList;
    if (filteredDriversList.length !== driversArray.length) {
      const taskIds = this.getFilteredTasks(filteredDriversList);
      filteredTasks = tasksList.filter(task => taskIds[task._id]);
    }

    return (
      <div className="App">
        <div className="main-section">
          <div className="sidebar flex-1">
            <Filters onFilter={this.filterDrivers} filters={filters} />
            <DriversList onDeleteDriver={this.onDeleteDriver}
                         drivers={filteredDriversList}
                         sortStatus={driversSort}
                         onOrder={this.onSortByField}
                         onLocate={this.locateDriver} />
          </div>
          <div className="map-container flex-2">
            <Map driversList={filteredDriversList} tasksList={tasksList} center={mapCenter} />
          </div>
        </div>
        <div className="tasks-list-container">
          <Tasks list={filteredTasks}
                 driversList={driversArray}
                 onAssignTask={this.onAssignTask}
                 onLocateTask={this.locateTask} />
        </div>
      </div>
    );
  }
}

export default App;
