import React, { Component } from 'react';
import './App.css';
import Filters from './components/filters/Filters';
import DriversList from './components/driversList/DriversList';
import Map from './components/map/Map';
import Tasks from './components/tasks/Tasks';
import Drivers from './models/drivers';
import TasksModel from './models/tasksModel';

const initialSort = {
  fullName: 0,
  age: 0,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.drivers = new Drivers();
    this.tasks = new TasksModel();

    this.state = {
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

  componentDidMount() {
    Promise.all([this.drivers.getAll(), this.tasks.getAll()])
      .then(responses => {
        this.setState({
          tasksList: responses[1],
          filteredDriversList: this.drivers.getDriversArray()
        })
      })
      .catch(console.error)
  }

  onDeleteDriver = (driver) => {
    if (driver && driver._id) {
      const filteredDriversList = this.drivers.deleteDriver(driver);
      this.setState({ filteredDriversList });
    }
  };

  setMapCenter(lat, lng) {
    this.setState({ mapCenter: { lat, lng } });
  }

  onToggleTask = (task = {}) => {
    const newTasks = this.tasks.toggleTaskShown(task._id);
    this.setState({ tasksList: newTasks });
  };

  onAssignTask = (taskId, driverId) => {
    const newTasksList = this.tasks.assignTask(taskId, driverId);

    const newDriversList = this.drivers.assignTask(taskId, driverId);
    this.setState({ tasksList: newTasksList, filteredDriversList: newDriversList });
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
    const filteredDrivers = this.drivers.filterDrivers(name, age);
    const sortedDrivers = this.sortDrivers(Object.values(filteredDrivers));
    this.setState({ filteredDriversList: sortedDrivers});
  };

  locateItem = (item = {}) => {
    if (item.location) {
      this.setMapCenter(item.location.latitude, item.location.longitude);
    }
  };

  render() {
    const { filteredDriversList, tasksList, mapCenter, filters, driversSort } = this.state;
    const driversArray = this.drivers.filterDrivers(this.state.filters.name, this.state.filters.age);
    let filteredTasks = tasksList;
    if (filteredDriversList.length !== driversArray.length) {
      const taskIds = this.drivers.getAllDriversTasks(filteredDriversList);
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
                         onLocate={this.locateItem} />
          </div>
          <div className="map-container flex-2">
            <Map driversList={filteredDriversList} tasksList={filteredTasks} center={mapCenter} />
          </div>
        </div>
        <div className="tasks-list-container">
          <Tasks list={filteredTasks}
                 driversList={driversArray}
                 onAssignTask={this.onAssignTask}
                 onToggleTask={this.onToggleTask}
                 onLocateTask={this.locateItem} />
        </div>
      </div>
    );
  }
}

export default App;
