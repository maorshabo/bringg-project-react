import React, { Component } from 'react';
import './App.css';
import Filters from './components/filters/Filters';
import DriversList from './components/driversList/DriversList';
import Map from './components/map/Map';
import Tasks from './components/tasks/Tasks';
import API from './utils/API';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      driversList: {},
      filteredDriversList: [],
      tasksList: [],
      driversSort: {
        name: 1,
        age: 1,
      },
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
    const { driversList } = this.state;
    if (driverId.length > 0) {
      if (!driversList[driverId].tasks || !Array.isArray(driversList[driverId].tasks)) {
        driversList[driverId].tasks = [];
      }
      driversList[driverId].tasks.push(taskId);
      this.setState({ driversList }, () => {
        this.filterDrivers(this.state.filters.name, this.state.filters.age);
      });
    }
  };

  sortDriversBy = (byField) => {
    const { driversSort, filteredDriversList } = this.state;
    driversSort[byField] *= -1;

    const sortedDrivers = filteredDriversList.sort((a, b) => {
      return a[byField] - b[byField];
    });

    this.setState({ driversSort, filteredDriversList: sortedDrivers });
  };

  filterDrivers = (name = '', age) => {
    if (name.length === 0 && (!age || age === 0)) {
      this.setState({
        filteredDriversList: Object.values(this.state.driversList),
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
        const firstName = driver.name.first.toLowerCase();
        const lastName = driver.name.last.toLowerCase();
        const isNameMatched = (firstName.indexOf(loweredName) > -1 || lastName.indexOf(loweredName) > -1);

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
        filteredDriversList,
        filters: {
          name,
          age
        }
      });
    }
  };

  locateTask = (task = {}) => {
    if (task.location) {
      this.setMapCenter(task.location.latitude, task.location.longitude);
    }
  };

  locateDriver = (driver = {}) => {
    if (driver.location) {
      this.setMapCenter(driver.location.latitude, driver.location.longitude);
    }
  };

  render() {
    const { filteredDriversList, tasksList, driversList, mapCenter, filters } = this.state;
    const driversArray = Object.values(driversList);
    return (
      <div className="App">
        <div className="main-section">
          <div className="sidebar flex-1">
            <Filters onFilter={this.filterDrivers} filters={filters} />
            <DriversList onDeleteDriver={this.onDeleteDriver}
                         drivers={filteredDriversList}
                         onLocate={this.locateDriver} />
          </div>
          <div className="map-container flex-2">
            <Map driversList={filteredDriversList} tasksList={tasksList} center={mapCenter} />
          </div>
        </div>
        <div className="tasks-list-container">
          <Tasks list={tasksList}
                 driversList={driversArray}
                 onAssignTask={this.onAssignTask}
                 onLocateTask={this.locateTask} />
        </div>
      </div>
    );
  }
}

export default App;
