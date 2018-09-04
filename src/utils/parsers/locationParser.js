function locationParser(location = {}) {
  let parsedLat = location.latitude;
  let parsedLng = location.longitude;
  try {
    parsedLat = Number.parseFloat(parsedLat);
    parsedLng = Number.parseFloat(parsedLng);
  } catch (e) {
    return {
      latitude: 0,
      longitude: 0,
    };
  }

  return {
    latitude: parsedLat,
    longitude: parsedLng,
  };
}

export default locationParser;