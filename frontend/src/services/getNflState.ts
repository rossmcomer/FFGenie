const getNflState = async () => {
  const response = await fetch(`https://api.sleeper.app/v1/state/nfl`);
  const data = await response.json();

  return data;
};

export default getNflState;
