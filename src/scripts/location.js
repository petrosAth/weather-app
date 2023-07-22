const getInput = () => {
  const input = document.querySelector('.search__input');
  return input.value;
};

const getLocation = async (getInput) => {
  const input = getInput();
  console.log(input);
};

const btnListener = (func) => {
  const btn = document.querySelector('.search__button');
  btn.addEventListener('click', () => func());
};

export { getInput, getLocation, btnListener };
