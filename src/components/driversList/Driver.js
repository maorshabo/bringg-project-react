import React from 'react';
import PropTypes from 'prop-types';

const Driver = (props) => {
  const { driver } = props;
  const driverName = `${driver.name.first} ${driver.name.last}`;

  const onLocate = () => {
    props.onLocate(props.driver);
  };

  const onDelete = () => {
    props.onDeleteDriver(props.driver);
  };

  return (
    <div className="driver-row">
      <div className="driver-image">
        <img src={driver.picture} alt={driverName}/>
      </div>
      <div className="driver-details">
        <h2 className="margin-0">{driverName}</h2>
        <h4 style={{ fontWeight: 400 }}>Age: {driver.age}</h4>

        <div className="driver-details-buttons">
          <span>Tasks: {(driver.tasks || []).length}</span>
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
  tasks: PropTypes.array,
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