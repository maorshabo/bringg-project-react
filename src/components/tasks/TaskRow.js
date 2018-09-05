import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { driverProps } from '../driversList/Driver';
import DriverSelector from './DriverSelector';

const TaskRow = (props) => {
  const { task } = props;
  const taskDate = moment(task.scheduled_at, "dddd, MMMM Do YYYY, h:mm:ss A").format('DD/MM/YYYY');

  const onShowClick = () => {
    props.onShowTaskClick(props.task);
  };

  const onToggleClick = () => {
    props.onToggleTaskClick(props.task);
  };

  const onDriverSelected = (driverId) => {
    props.onAssignTask(props.task._id, driverId);
  };

  const toggleButtonClasses = `btn ${task.isShown ? 'btn-danger' : 'btn-success'}`;
  const toggleButtonLabel = task.isShown ? 'Hide' : 'Show';
  return (
    <tr>
      <td>{task.title}</td>
      <td>{taskDate}</td>
      <td><DriverSelector selectedDriverId={task.driverId} drivers={props.driversList} onSelect={onDriverSelected}/></td>
      <td>{task.address}</td>
      <td>{task.location.latitude}</td>
      <td>{task.location.longitude}</td>
      <td>
        <button className="btn btn-success" onClick={onShowClick}>Show</button>
      </td>
      <td>
        <button className={toggleButtonClasses} onClick={onToggleClick}>{toggleButtonLabel}</button>
      </td>
    </tr>
  );
};

export const TaskProps = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  scheduled_at: PropTypes.string.isRequired,
  location: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired
  }),
  driverId: PropTypes.string
};

TaskRow.propTypes = {
  task: PropTypes.shape(TaskProps).isRequired,
  onShowTaskClick: PropTypes.func.isRequired,
  onToggleTaskClick: PropTypes.func.isRequired,
  driversList: PropTypes.arrayOf(PropTypes.shape(driverProps)),
  onAssignTask: PropTypes.func.isRequired
};

TaskRow.defaultProps = {
  //myProp: <defaultValue>
};

export default TaskRow;