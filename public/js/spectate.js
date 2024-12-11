document.addEventListener('DOMContentLoaded', async () => {
  if (getLocalStorage('selectedSummonerProfile')) {
    const { selectedSummonerProfile } = getLocalStorage('selectedSummonerProfile');
    console.log(selectedSummonerProfile);
  }
});
