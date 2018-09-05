import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Driver, { driverProps } from './Driver';
import './driversList.css';

class DriversList extends PureComponent {

  onShowOnMapClick = (driver) => {
    this.props.onLocate(driver);
  };

  sortList = (byField) => {
    this.props.onOrder(byField);
  };

  deleteDriver = (driver) => {
    this.props.onDeleteDriver(driver);
  };

  renderDriversNotFound() {
    if (this.props.drivers.length > 0) return;
    return <p>No Drivers Found</p>;
  }

  renderSortButton = (sortField, sortLabel) => {
    const { sortStatus } = this.props;
    return (
      <a
        className="cursor-pointer sort-button"
        onClick={this.sortList.bind(this, sortField)}>{sortStatus[sortField] === 1 ? '↑' : (sortStatus[sortField] === -1 ? '↓' : '')} {sortLabel} </a>
    );
  };

  render() {
    const { drivers } = this.props;
    const notFoundMessage = this.renderDriversNotFound();
    const sortByName = this.renderSortButton('fullName', 'Name');
    const sortByAge = this.renderSortButton('age', 'Age');
    return (
      <div>
        <div className="drivers-header">
          <h3>Drivers List ({drivers.length})</h3>
          <div>
            <span>Sort by: </span>
            {sortByName}
            {sortByAge}
          </div>
        </div>
        <div className="drivers-list-container">
          {drivers.map(driver => <Driver key={driver._id}
                                         driver={driver}
                                         onLocate={this.onShowOnMapClick}
                                         onDeleteDriver={this.deleteDriver} />
          )}
          {notFoundMessage}
        </div>
      </div>
    );
  }
}

DriversList.propTypes = {
  drivers: PropTypes.arrayOf(PropTypes.shape(driverProps)).isRequired,
  onDeleteDriver: PropTypes.func.isRequired,
  onLocate: PropTypes.func.isRequired,
  onOrder: PropTypes.func.isRequired,
  sortStatus: PropTypes.object.isRequired
};

export default DriversList;