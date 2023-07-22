const getInput = () => {
  const input = document.querySelector('.search__input');
  return input.value;
};

const getLocation = async (apiCall, url, key, params) => {
  const location = await apiCall('geo', url, key, params);
  return location[0];
};

export { getInput, getLocation };
