window.GigiFixtures = (() => {
  const officialTypes = ['competitie','beker','knvb beker','play-off','nacompetitie'];
  const parseDate = value => new Date(value).getTime();
  const isOfficial = match => officialTypes.some(type => `${match.type||''} ${match.competition||''}`.toLowerCase().includes(type));
  const future = matches => matches.filter(match => parseDate(match.date) > Date.now()).sort((a,b)=>parseDate(a.date)-parseDate(b.date));
  const nextFirstTeam = matches => {
    const upcoming=future(matches);
    return upcoming.find(isOfficial) || upcoming[0] || null;
  };
  const nextHome = matches => {
    const upcoming=future(matches).filter(match => (match.home||'').toLowerCase()==='gigi-united');
    return upcoming.find(isOfficial) || upcoming[0] || null;
  };
  const nextYouthCompetition = matches => future(matches).find(match => `${match.type||''}`.toLowerCase().includes('jeugdcompetitie')) || null;
  const formatDate = value => new Intl.DateTimeFormat('nl-NL',{weekday:'long',day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(value));
  const formatShort = value => new Intl.DateTimeFormat('nl-NL',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(value));
  const startCountdown = (targetValue, root) => {
    const target=parseDate(targetValue);
    const nodes={days:root.querySelector('[data-days]'),hours:root.querySelector('[data-hours]'),minutes:root.querySelector('[data-minutes]'),seconds:root.querySelector('[data-seconds]')};
    const tick=()=>{let d=Math.max(0,target-Date.now());const days=Math.floor(d/86400000);d%=86400000;const hours=Math.floor(d/3600000);d%=3600000;const minutes=Math.floor(d/60000);d%=60000;const seconds=Math.floor(d/1000);nodes.days&&(nodes.days.textContent=String(days).padStart(2,'0'));nodes.hours&&(nodes.hours.textContent=String(hours).padStart(2,'0'));nodes.minutes&&(nodes.minutes.textContent=String(minutes).padStart(2,'0'));nodes.seconds&&(nodes.seconds.textContent=String(seconds).padStart(2,'0'));};
    tick(); return setInterval(tick,1000);
  };
  return {nextFirstTeam,nextHome,nextYouthCompetition,formatDate,formatShort,startCountdown};
})();