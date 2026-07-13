async function loadPressRoom(){
 const target=document.querySelector('#press-list');
 try{
  const items=await fetch('../data/perskamer.json',{cache:'no-store'}).then(r=>r.json());
  const sorted=[...items].sort((a,b)=>new Date(b.date)-new Date(a.date));
  target.innerHTML=sorted.map(item=>`<article class="press-release"><div class="press-meta"><span>${item.type}</span><time>${new Intl.DateTimeFormat('nl-NL',{day:'numeric',month:'long',year:'numeric'}).format(new Date(item.date))}</time></div><h2>${item.title}</h2><p class="press-intro">${item.intro}</p>${(item.body||[]).map(p=>`<p>${p}</p>`).join('')}${(item.quotes||[]).map(q=>`<blockquote>${q.text}<cite>${q.speaker}</cite></blockquote>`).join('')}</article>`).join('');
 }catch(e){target.innerHTML='<p>Persberichten konden niet worden geladen.</p>';console.error(e)}
}
loadPressRoom();