import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Driver, { driverProps } from './Driver';
import './driversList.css';

class DriversList extends PureComponent {

  onShowOnMapClick = (driver) => {
    this.props.onLocate(driver);
  };

  sortList = (byField) => {

  };

  deleteDriver = (driver) => {
    this.props.onDeleteDriver(driver);
  };

  renderDriversNotFound() {
    if (this.props.drivers.length > 0) return;
    return <p>No Drivers Found</p>;
  }

  render() {
    const { drivers } = this.props;
    const notFoundMessage = this.renderDriversNotFound();
    return (
      <div className="drivers-list-container">
        <h3>Drivers List ({drivers.length})</h3>
        {drivers.map(driver => <Driver key={driver._id}
                                       driver={driver}
                                       onLocate={this.onShowOnMapClick}
                                       onDeleteDriver={this.deleteDriver} />
        )}
        {notFoundMessage}
      </div>
    );
  }
}

DriversList.propTypes = {
  drivers: PropTypes.arrayOf(PropTypes.shape(driverProps)).isRequired,
  onDeleteDriver: PropTypes.func.isRequired,
  onLocate: PropTypes.func.isRequired
};

export default DriversList;