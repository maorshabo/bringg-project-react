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
      currentCenter: props.center
    };
    this.mapRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.center !== this.props.center) {
      this.mapRef.current.panTo(this.props.center);
    }
  }

  static getDerivedStateFromProps(props, state) {
    const currentDriversIds = state.driversMarkers.map(marker => marker.key).join(',');
    const currentTasksIds = state.tasksMarkers.map(marker => marker.key).join(',');
    const newDriversIds = props.driversList.map(driver => driver._id).join(',');
    const newTasksIds = props.tasksList.map(task => task._id).join(',');

    const newTasksIsShown = props.tasksList.filter(t => t.isShown);

    if (newDriversIds !== currentDriversIds || newTasksIds !== currentTasksIds) {
      return {
        driversMarkers: props.driversList.map(driver => <Marker key={driver._id} icon={driverIcon} title={`${driver.name.first} ${driver.name.last}`} position={{lat: driver.location.latitude, lng: driver.location.longitude}} />),
        tasksMarkers: props.tasksList.filter(task => task.isShown).map(task => <Marker key={task._id} icon={packageIcon} title={task.title} position={{lat: task.location.latitude, lng: task.location.longitude}} />)
      };
    }
    if (newTasksIsShown.length !== state.tasksMarkers.length) {
      return {
        tasksMarkers: props.tasksList.filter(task => task.isShown).map(task => <Marker key={task._id} icon={packageIcon} title={task.title} position={{lat: task.location.latitude, lng: task.location.longitude}} />)
      }
    }
    if (props.center.latitude !== state.currentCenter.latitude || props.center.longitude !== state.currentCenter.longitude) {
      return {
        currentCenter: props.center
      };
    }

    return null;
  }

  render() {
    const { driversMarkers, tasksMarkers, currentCenter } = this.state;
    return (
      <div>
        <GoogleMap
          ref={this.mapRef}
          defaultZoom={8}
          defaultCenter={{ lat: -34.397, lng: 150.644 }}
          center={currentCenter}
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
  tasksList: PropTypes.arrayOf(PropTypes.shape({TaskProps})),
  center: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired
};

Map.defaultProps = {
  driversList: [],
  tasksList: []
};

export default withDefaultMapProps(withScriptjs(withGoogleMap(Map)));
