import React from 'react';

const withDefaultMapProps = (WrappedComponent) => (props) => {
  return (
    <div>
      <WrappedComponent {...props}
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDZDvjWxFb0ewPKV9AkhQxBHCB8fDnZHfA&v=3.exp&libraries=geometry,drawing,places"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `400px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}>
        {props.children}
      </WrappedComponent>
    </div>
  )
};

export default withDefaultMapProps;