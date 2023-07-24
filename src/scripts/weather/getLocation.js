const getLocation = async (apiCall, url, key, location) => {
  const newLocation = await apiCall(url(key, location).geo);
  return newLocation;
};

export { getLocation }
