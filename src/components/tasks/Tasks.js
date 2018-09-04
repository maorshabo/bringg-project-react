import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TaskRow, { TaskProps } from './TaskRow';

class Tasks extends Component {

  onShowTaskOnMapClick = (task) => {
    console.log(task);
  };

  render() {
    const { list } = this.props;
    return (
      <div>
        <h3>Total Tasks: {list.length}</h3>
        <table>
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
          {list.map(task => <TaskRow task={task} onShowTaskClick={this.onShowTaskOnMapClick} key={task._id} />)}
          </tbody>
        </table>
      </div>
    );
  }
}

Tasks.propType = {
  list: PropTypes.arrayOf(TaskProps).isRequired
};

Tasks.defaultPropTypes = {};

export default Tasks;