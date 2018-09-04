import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const TaskRow = (props) => {
  const { task } = props;
  const taskDate = moment(task.scheduled_at).format('DD/MM/YYYY');

  const onShowClick = () => {
    props.onShowTaskClick(props.task);
  };

  return (
    <tr>
      <td>{task.title}</td>
      <td>{taskDate}</td>
      <td>{task.address}</td>
      <td>{task.location.latitude}</td>
      <td>{task.location.longitude}</td>
      <td>
        <button onClick={onShowClick}>Show</button>
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
    latitude: PropTypes.string.isRequired,
    longitude: PropTypes.string.isRequired
  })
};

TaskRow.propTypes = {
  task: PropTypes.shape(TaskProps).isRequired,
  onShowTaskClick: PropTypes.func.isRequired
};

TaskRow.defaultProps = {
  //myProp: <defaultValue>
};

export default TaskRow;