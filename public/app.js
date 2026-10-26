const form = document.querySelector('#order-form');
const input = document.querySelector('#order-text');
const status = document.querySelector('#status');
const ticket = document.querySelector('#ticket');
const agentMessage = document.querySelector('#agent-message');
const agentMessages = ['Halo. Sebutkan pesanan, Idzkar yang rapikan.', 'Kuah siap. Tinggal tulis pesananmu.', 'Santai, bahasa warung juga Idzkar paham.'];
let agentIndex = 0;
setInterval(() => { if (agentMessage && document.activeElement !== input) { agentIndex = (agentIndex + 1) % agentMessages.length; agentMessage.classList.remove('message-in'); void agentMessage.offsetWidth; agentMessage.textContent = agentMessages[agentIndex]; agentMessage.classList.add('message-in'); } }, 4200); 
input.addEventListener('focus', () => { if (agentMessage) agentMessage.textContent = 'Idzkar menyimak. Tulis semua sekalian.'; });
input.addEventListener('blur', () => { if (agentMessage && !input.value) agentMessage.textContent = agentMessages[agentIndex]; });

const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); }), {threshold: 0.16});
document.querySelectorAll('.intro, .menu-section, .kitchen, .video-section, .closing').forEach((section) => { section.classList.add('reveal'); revealObserver.observe(section); });

// Keep motion respectful for users who disable animation.
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.classList.add('reduce-motion');

function animateButton(button) { button.classList.remove('button-pop'); void button.offsetWidth; button.classList.add('button-pop'); } 
form.querySelector('button').addEventListener('click', () => animateButton(form.querySelector('button')));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function renderTicket(data) {
  const groups = [['Soto', data.Soto], ['Minuman', data.Minuman], ['Pelengkap', data.Pelengkap]];
  const content = groups.map(([name, items]) => items.length ? `<div class="ticket-group">${name.toUpperCase()}</div>${items.map((x) => `<label class="ticket-item"><input type="checkbox"><span><b>${esc(x.qty)}× ${esc(x.item)}</b>${x.varian ? `<small>${esc(x.varian)}</small>` : ''}${x.catatan ? `<small>${esc(x.catatan)}</small>` : ''}</span></label>`).join('')}` : '').join('');
  const unknown = data.unknown_items?.length ? `<div class="ticket-group">PERLU CEK</div><div class="ticket-item"><span>${data.unknown_items.map(esc).join(', ')}</span></div>` : '';
  ticket.className = 'ticket';
  ticket.innerHTML = `<div class="ticket-top"><span>SOTO SORE KALIJAMBI</span><span>● READY</span></div><div class="ticket-content">${content || '<p>Tidak ada item dikenali.</p>'}${unknown}</div><div class="ticket-bottom">PERIKSA TIKET SEBELUM DIRACIK</div>`;
}
// Schedule toggle logic
let scheduleMode = 'today';
const chipBtns = document.querySelectorAll('.chip-btn');
const scheduleInputs = document.querySelector('#schedule-inputs');
const dateInput = document.querySelector('#order-date');
const timeInput = document.querySelector('#order-time');

if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
  dateInput.value = today;
}

chipBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    chipBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    scheduleMode = btn.dataset.time;
    if (scheduleMode === 'later') {
      scheduleInputs.classList.remove('hidden');
    } else {
      scheduleInputs.classList.add('hidden');
    }
  });
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const order = input.value.trim().replace(/\s+/g, ' ');
  if (order.length < 3) return;
  const button = form.querySelector('button');
  button.disabled = true;
  status.textContent = 'Idzkar sedang merapikan…';
  
  // Format waktu pesanan
  let scheduleText = 'Hari ini';
  if (scheduleMode === 'later') {
    const dVal = dateInput ? dateInput.value : '';
    const tVal = timeInput ? timeInput.value : '';
    if (dVal && tVal) {
      scheduleText = `${dVal} pukul ${tVal} WIB`;
    } else if (dVal) {
      scheduleText = `Tanggal ${dVal}`;
    } else if (tVal) {
      scheduleText = `Hari ini pukul ${tVal} WIB`;
    }
  }

  try {
    const response = await fetch('/api/orders/assist', {
      method: 'POST',
      headers: {'content-type':'application/json'},
      body: JSON.stringify({text: order, schedule: scheduleText})
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'AI sedang tidak tersedia.');
    const rawText = String(data.text || '').replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\r\n/g, '\n').trim();
    const url = `https://wa.me/6281228179881?text=${encodeURIComponent(rawText)}`;
    
    // Update live estimate and smart suggestion box
    const estimateBox = document.querySelector('#ai-estimate');
    const totalEl = document.querySelector('#ai-total');
    const suggEl = document.querySelector('#ai-suggestion');
    if (estimateBox && data.total > 0) {
      estimateBox.classList.remove('hidden');
      if (totalEl) totalEl.textContent = `Rp${data.total.toLocaleString('id-ID')}`;
      if (suggEl) {
        if (data.suggestion) {
          suggEl.style.display = 'block';
          suggEl.textContent = data.suggestion;
        } else {
          suggEl.style.display = 'none';
        }
      }
    }
    
    status.textContent = 'Pesan rapi siap dikirim ke WhatsApp.';
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (error) {
    status.textContent = 'AI gagal. Coba lagi atau gunakan WhatsApp langsung.';
  } finally { button.disabled = false; }
});
