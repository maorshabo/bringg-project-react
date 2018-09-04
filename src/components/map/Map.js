import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, Marker, withGoogleMap, withScriptjs } from "react-google-maps";
import withDefaultMapProps from './withDefaultMapProps';
import { driverProps } from '../driversList/Driver';
import { TaskProps } from '../tasks/TaskRow';

const driverIcon = require('../../assets/driver.png');
const packageIcon = require('../../assets/packageIcon.png');

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      driversMarkers: [],
      tasksMarkers: [],
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.driversMarkers !== state.driversMarkers || props.tasksMarkers !== state.tasksMarkers) {
      return {
        driversMarkers: props.driversList.map(driver => <Marker key={driver._id} icon={driverIcon} title={`${driver.name.first} ${driver.name.last}`} position={{lat: driver.location.latitude, lng: driver.location.longitude}} />),
        tasksMarkers: props.tasksList.map(task => <Marker key={task._id} icon={packageIcon} title={task.title} position={{lat: task.location.latitude, lng: task.location.longitude}} />)
      };
    }

    // Return null if the state hasn't changed
    return null;
  }

  render() {
    const { driversMarkers, tasksMarkers } = this.state;
    return (
      <div>
        <GoogleMap
          defaultZoom={8}
          defaultCenter={{ lat: -34.397, lng: 150.644 }}
        >
          {driversMarkers}
          {tasksMarkers}
        </GoogleMap>
      </div>
    );
  }
}

Map.propTypes = {
  driversList: PropTypes.arrayOf(PropTypes.shape(driverProps)),
  tasksList: PropTypes.arrayOf(PropTypes.shape({TaskProps}))
};

Map.defaultProps = {
  driversList: [],
  tasksList: []
};

export default withDefaultMapProps(withScriptjs(withGoogleMap(Map)));
