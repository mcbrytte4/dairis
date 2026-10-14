const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
const colores = ['#F4B6C8','#F9D2DE','#E99AB4','#FBC08A','#F6C453','#F2A2B0'];
function petalo(){
  if (quieto) return;
  const p = document.createElementNS('http://www.w3.org/2000/svg','svg');
  const s = 14 + Math.random()*14;
  p.setAttribute('viewBox','-2 -10 22 14'); p.setAttribute('width',s); p.setAttribute('height',s);
  p.innerHTML = Math.random() < .25
    ? `<use href="#heart" transform="translate(9 -2) scale(.45)" fill="${Math.random()<.5?'#E26D7F':'#EE8D45'}"/>`
    : `<path d="M0,0 C8,-8 16,-6 18,2 C12,0 6,4 0,0Z" fill="${colores[Math.random()*colores.length|0]}"/>`;
  p.classList.add('petalo');
  p.style.left = Math.random()*100 + 'vw';
  p.style.setProperty('--dx', (Math.random()*160-80) + 'px');
  p.style.setProperty('--r', (Math.random()*540) + 'deg');
  p.style.animationDuration = (7 + Math.random()*6) + 's';
  document.body.appendChild(p);
  p.addEventListener('animationend', () => p.remove());
}
function lluvia(n){ for (let i=0;i<n;i++) setTimeout(petalo, i*260); }
const feliz = document.querySelector('.feliz');
let k = 0;
feliz.innerHTML = feliz.textContent.split(' ').map(w =>
  `<span class="w">${[...w].map(c => `<span class="l" style="transition-delay:${(k++)*55}ms">${c}</span>`).join('')}</span>`).join(' ');
const num = document.querySelector('.num');
function portada(){
  feliz.classList.add('ver');
  document.querySelector('.hero').classList.add('listo');
  if (quieto) return;
  let n = 0; num.textContent = '0';
  const t = setInterval(() => { n++; num.textContent = n; if (n >= 21) clearInterval(t); }, 55);
}
const musica = document.getElementById('musica');
const btnMusica = document.getElementById('btnMusica');
function sonar(){
  musica.volume = 0;
  musica.play().then(() => {
    btnMusica.hidden = false;
    const t = setInterval(() => { musica.volume = Math.min(.45, musica.volume + .03); if (musica.volume >= .45) clearInterval(t); }, 120);
  }).catch(() => {});
}
btnMusica.addEventListener('click', () => musica.paused ? musica.play() : musica.pause());
musica.addEventListener('play', () => { btnMusica.classList.remove('pausa'); btnMusica.setAttribute('aria-label','Pausar música'); });
musica.addEventListener('pause', () => { btnMusica.classList.add('pausa'); btnMusica.setAttribute('aria-label','Reproducir música'); });
let pausadaAlSalir = false;
document.addEventListener('visibilitychange', () => {
  if (document.hidden && !musica.paused){ pausadaAlSalir = true; musica.pause(); }
  else if (!document.hidden && pausadaAlSalir){ pausadaAlSalir = false; musica.play().catch(() => {}); }
});
document.getElementById('abrir').addEventListener('click', () => {
  if (document.getElementById('sobre').classList.contains('abierto')) return;
  document.getElementById('sobre').classList.add('abierto');
  scrollTo(0, 0);
  navigator.vibrate?.(30);
  sonar();
  setTimeout(portada, quieto ? 0 : 1700);
  document.body.classList.remove('locked');
  lluvia(18);
  setInterval(petalo, 1400);
});
const btn = document.getElementById('btnDeseo');
const pastel = document.getElementById('pastel');
function soplar(){
  if (btn.disabled) return;
  btn.disabled = true;
  btn.textContent = 'Feliz cumpleañooo que se cumpla todo lo pedido';
  pastel.classList.add('apagado');
  navigator.vibrate?.([40, 60, 40]);
  setTimeout(() => document.getElementById('msgDeseo').classList.add('ver'), 600);
  if (quieto) return;
  const r = pastel.getBoundingClientRect();
  for (let i=0;i<26;i++){
    const b = document.createElementNS('http://www.w3.org/2000/svg','svg');
    b.setAttribute('viewBox','-20 -22 40 34'); b.setAttribute('width',22); b.setAttribute('height',22);
    b.innerHTML = Math.random()<.5 ? `<use href="#heart" fill="${['#E26D7F','#EE8D45','#F2A2B0','#F6C453'][i%4]}"/>`
                                   : '<use href="#spark" fill="#E8B86A" transform="scale(1.4)"/>';
    b.classList.add('burst');
    b.style.left = (r.left + r.width/2 - 11) + 'px';
    b.style.top = (r.top + r.height*0.2 - 11) + 'px';
    const a = Math.random()*Math.PI*2, d = 80 + Math.random()*140;
    b.style.setProperty('--dx', Math.cos(a)*d + 'px');
    b.style.setProperty('--dy', (Math.sin(a)*d - 60) + 'px');
    document.body.appendChild(b);
    b.addEventListener('animationend', () => b.remove());
  }
  lluvia(14);
}
btn.addEventListener('click', soplar);
pastel.addEventListener('click', soplar);
const io = new IntersectionObserver((es) => es.forEach(x => { if (x.isIntersecting){ x.target.classList.add('ver'); io.unobserve(x.target); } }), {threshold:.12});
document.querySelectorAll('.reveal, .cascada').forEach(el => io.observe(el));
document.querySelectorAll('.cascada').forEach(c => [...c.children].forEach((h,i) => h.style.setProperty('--i', i)));
if (!quieto && matchMedia('(hover:hover) and (pointer:fine)').matches){
  document.querySelectorAll('.fav').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(800px) rotateX(${-y*7}deg) rotateY(${x*7}deg) translateY(-4px)`;
      card.classList.add('tilt');
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; card.classList.remove('tilt'); });
  });
}
document.addEventListener('click', e => {
  if (quieto || e.target.closest('button, a, #sobre')) return;
  const h = document.createElementNS('http://www.w3.org/2000/svg','svg');
  h.setAttribute('viewBox','-20 -22 40 34'); h.setAttribute('width',20); h.setAttribute('height',20);
  h.innerHTML = `<use href="#heart" fill="${['#E26D7F','#EE8D45','#F2A2B0'][Math.random()*3|0]}"/>`;
  h.classList.add('burst');
  h.style.left = (e.clientX - 10) + 'px'; h.style.top = (e.clientY - 10) + 'px';
  h.style.setProperty('--dx', (Math.random()*40-20) + 'px'); h.style.setProperty('--dy', '-70px');
  document.body.appendChild(h);
  h.addEventListener('animationend', () => h.remove());
});
const tonos = [[245,227,222],[250,232,216],[246,226,232],[240,225,238]];
const scrollHint = document.querySelector('.scroll');
function alBajar(){
  const max = document.documentElement.scrollHeight - innerHeight;
  const f = max > 0 ? Math.min(1, scrollY / max) : 0;
  const p = f * (tonos.length - 1), i = Math.min(tonos.length - 2, Math.floor(p)), t = p - i;
  const c = tonos[i].map((v,k) => Math.round(v + (tonos[i+1][k] - v) * t));
  document.body.style.setProperty('--fondo', `rgb(${c})`);
  scrollHint.classList.toggle('fuera', scrollY > 60);
}
let pendiente = false;
addEventListener('scroll', () => {
  if (pendiente) return;
  pendiente = true;
  requestAnimationFrame(() => { pendiente = false; alBajar(); });
}, {passive:true});
alBajar();
const visor = document.getElementById('visor');
const visorImg = visor.querySelector('img');
document.querySelectorAll('.fotos img').forEach(img => img.addEventListener('click', () => {
  visorImg.src = img.src; visorImg.alt = img.alt;
  visor.hidden = false;
}));
visor.addEventListener('click', () => visor.hidden = true);
addEventListener('keydown', e => { if (e.key === 'Escape') visor.hidden = true; });
