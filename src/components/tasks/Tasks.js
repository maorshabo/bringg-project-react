import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TaskRow, { TaskProps } from './TaskRow';
import './tasks.css';
import { driverProps } from '../driversList/Driver';

class Tasks extends Component {

  onShowTaskOnMapClick = (task) => {
    if (task.hasOwnProperty('isShown')) {
      task.isShown = !task.isShown;
    }
    this.props.onLocateTask(task);
  };

  onAssignTask = (taskId, driverId) => {
    this.props.onAssignTask(taskId, driverId);
  };

  render() {
    const { list, driversList } = this.props;
    return (
      <div>
        <h3>Total Tasks: {list.length}</h3>
        <table className="tasks-table">
          <thead>
          <tr>
            <td>Title</td>
            <td>Scheduled to</td>
            <td>Assign to</td>
            <td>Address</td>
            <td>Lat</td>
            <td>Lng</td>
            <td>Locate on map</td>
          </tr>
          </thead>
          <tbody>
          {list.map(task => <TaskRow task={task} driversList={driversList} onAssignTask={this.onAssignTask} onShowTaskClick={this.onShowTaskOnMapClick} key={task._id} />)}
          </tbody>
        </table>
      </div>
    );
  }
}

Tasks.propType = {
  list: PropTypes.arrayOf(TaskProps).isRequired,
  driversList: PropTypes.arrayOf(PropTypes.shape(driverProps)),
  onAssignTask: PropTypes.func.isRequired,
  onLocateTask: PropTypes.func.isRequired
};

Tasks.defaultPropTypes = {};

export default Tasks;