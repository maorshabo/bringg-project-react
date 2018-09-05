import React from 'react';
import PropTypes from 'prop-types';

const Driver = (props) => {
  const { driver } = props;

  const onLocate = () => {
    props.onLocate(props.driver);
  };

  const onDelete = () => {
    props.onDeleteDriver(props.driver);
  };

  const tasksCount = Object.values(driver.tasks || {}).filter(bool => bool).length;

  return (
    <div className="driver-row">
      <div className="driver-image">
        <img src={driver.picture} alt={driver.fullName}/>
      </div>
      <div className="driver-details">
        <h2 className="margin-0">{driver.fullName}</h2>
        <h4 style={{ fontWeight: 400 }}>Age: {driver.age}</h4>

        <div className="driver-details-buttons">
          <span>Tasks: {tasksCount}</span>
          <button className="btn btn-danger" onClick={onDelete}>Delete</button>
          <button className="btn btn-success" onClick={onLocate}>Show on map</button>
        </div>
      </div>
    </div>
  );
};

export const driverProps = {
  name: PropTypes.shape({
    first: PropTypes.string.isRequired,
    last: PropTypes.string.isRequired,
  }),
  age: PropTypes.number.isRequired,
  picture: PropTypes.string.isRequired,
  tasks: PropTypes.object,
  location: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  })
};

Driver.propTypes = {
  driver: PropTypes.shape(driverProps).isRequired,
  onLocate: PropTypes.func.isRequired,
  onDeleteDriver: PropTypes.func.isRequired
};

Driver.defaultProps = {
  //myProp: <defaultValue>
};

export default Driver;