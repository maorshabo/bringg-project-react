import React, { Component } from 'react';
import { GoogleMap, Marker, withGoogleMap, withScriptjs } from "react-google-maps";
import withDefaultMapProps from './withDefaultMapProps';

class Map extends Component {
  render() {
    return (
      <div>
        <GoogleMap
          defaultZoom={8}
          defaultCenter={{ lat: -34.397, lng: 150.644 }}
        >
          <Marker position={{ lat: -34.397, lng: 150.644 }} />
        </GoogleMap>
      </div>
    );
  }
}

Map.propTypes = {};

Map.defaultProps = {

};

export default withDefaultMapProps(withScriptjs(withGoogleMap(Map)));