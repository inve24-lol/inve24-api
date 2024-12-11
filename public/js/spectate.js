document.addEventListener('DOMContentLoaded', async () => {
  if (getLocalStorage('selectedSummonerProfile')) {
    const { selectedSummonerProfile } = getLocalStorage('selectedSummonerProfile');
    console.log(selectedSummonerProfile);
    displaySummonerProfile(selectedSummonerProfile);
  }
});

const displaySummonerProfile = (summoner) => {
  setRankImg('rank_img', summoner.tier);
  replaceText('summoner_name', summoner.gameName);
  replaceText('summoner_tag', `#${summoner.tagLine}`);
  replaceText('league_tier', `${summoner.tier} ${summoner.rank}`);
  replaceText('league_point', `${summoner.leaguePoints} LP`);
  replaceText(
    'league_score',
    `${summoner.wins}승 ${summoner.losses}패 승률 ${parseInt((summoner.wins / (summoner.wins + summoner.losses)) * 100)}%`,
  );
};
