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
      driversList: [],
      filteredDriversList: [],
      tasksList: [],
      driversSort: {
        name: 1,
        age: 1,
      }
    }
  }

  componentDidMount() {
    Promise.all([API.getDrivers(), API.getTasks()])
      .then(responses => {
        this.setState({
          driversList: responses[0],
          tasksList: responses[1],
          filteredDriversList: responses[0]
        })
      })
      .catch(console.error)
  }

  onDeleteDriver = (driver) => {

  };

  onAssignTask = (task, driver) => {
    console.log(task);
    console.log(driver);
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
        filteredDriversList: this.state.driversList
      });
    }
    else {
      const { driversList } = this.state;
      const loweredName = name.toLowerCase();
      const filteredDriversList = driversList.filter(driver => {
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
      this.setState({ filteredDriversList });
    }
  };

  render() {
    const { filteredDriversList, tasksList, driversList } = this.state;
    return (
      <div className="App">
        <div className="main-section">
          <div className="sidebar flex-1">
            <Filters onFilter={this.filterDrivers} />
            <DriversList onDeleteDriver={this.onDeleteDriver} drivers={filteredDriversList} />
          </div>
          <div className="map-container flex-2">
            <Map />
          </div>
        </div>
        <div className="tasks-list-container">
          <Tasks list={tasksList} driversList={driversList} />
        </div>
      </div>
    );
  }
}

export default App;
