import React from 'react';
import PropTypes from 'prop-types';
import { driverProps } from '../driversList/Driver';

const DriverSelector = (props) => {

  const onDriverSelected = (event) => {
    props.onSelect(event.target.value);
  };

  return (
    <select onChange={onDriverSelected}>
      <option value="">Select driver</option>
      {props.drivers.map(driver => <option key={driver._id} value={driver._id}>{driver.name.first} {driver.name.last}</option>)}
    </select>
  );
};

DriverSelector.propTypes = {
  drivers: PropTypes.arrayOf(PropTypes.shape(driverProps)).isRequired,
  onSelect: PropTypes.func.isRequired
};

DriverSelector.defaultProps = {};

export default DriverSelector;