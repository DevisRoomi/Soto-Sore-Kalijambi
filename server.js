const port = Number(process.env.PORT || 8787);
const root = new URL('./public/', import.meta.url);

const menu = {
  soto: [
    { item: 'Soto Ayam Porsi Besar', aliases: ['soto gede', 'soto besar', 'soto ayam besar'], price: 8000 },
    { item: 'Soto Ayam Porsi Kecil', aliases: ['soto kecil', 'soto ayam kecil'], price: 4000 },
  ],
  minuman: [
    { item: 'Teh', aliases: ['es teh', 'teh es', 'teh hangat', 'teh panas', 'teh'], price: 3000 },
    { item: 'Jeruk', aliases: ['es jeruk', 'jeruk es', 'jeruk hangat', 'jeruk panas', 'jeruk'], price: 4000 },
    { item: 'Susu', aliases: ['es susu', 'susu es', 'susu hangat', 'susu panas', 'susu'], price: 4000 },
  ],
  pelengkap: [
    { item: 'Gorengan', aliases: ['gorengan'], price: 1000 },
    { item: 'Tusukan', aliases: ['tusukan', 'sate'], price: 3000 },
    { item: 'Krupuk', aliases: ['krupuk', 'kerupuk'], price: 1000 },
    { item: 'Pangsit', aliases: ['pangsit'], price: 1500 },
  ],
};

const clean = (text) => text.toLowerCase().replace(/[.!?]/g, ',').replace(/\s+/g, ' ').trim();
const qtyOf = (s) => Number((s.match(/(?:^|\s)(\d+)\b/) || [0, 1])[1]);
const noteOf = (s) => {
  const m = s.match(/(?:yang |yg )?(tanpa|ga pake|gak pake|tidak pakai|pisah|dipisah)([^,]*)/i);
  return m ? `${m[1]}${m[2]}`.trim() : '';
};

function parseOrder(text) {
  const input = clean(text);
  const result = { Soto: [], Minuman: [], Pelengkap: [], unknown_items: [] };
  const chunks = input.split(/,|\bdan\b|\bsama\b/).map((x) => x.trim()).filter(Boolean);
  const used = new Set();
  for (const chunk of chunks) {
    let found = false;
    for (const [category, items] of Object.entries(menu)) {
      for (const item of items) {
        const alias = [...item.aliases].sort((a, b) => b.length - a.length).find((a) => chunk.includes(a));
        if (!alias || used.has(`${category}:${alias}:${chunk}`)) continue;
        const entry = { item: item.item, qty: qtyOf(chunk), catatan: noteOf(chunk) };
        if (category === 'minuman') entry.varian = /\bes\b/.test(chunk) ? 'Es' : /hangat|panas/.test(chunk) ? 'Hangat' : '';
        result[category === 'soto' ? 'Soto' : category === 'minuman' ? 'Minuman' : 'Pelengkap'].push(entry);
        used.add(`${category}:${alias}:${chunk}`); found = true; break;
      }
      if (found) break;
    }
    if (!found) result.unknown_items.push(chunk);
  }
  return result;
}

function json(data, status = 200) { return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8' } }); }

function normalizeText(text) {
  return String(text || '')
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function calculateOrder(cleanInput) {
  const parsed = parseOrder(cleanInput);
  const items = [];
  let total = 0;
  for (const cat of ['Soto', 'Minuman', 'Pelengkap']) {
    for (const it of parsed[cat]) {
      const categoryKey = cat === 'Soto' ? 'soto' : cat === 'Minuman' ? 'minuman' : 'pelengkap';
      const def = menu[categoryKey].find((m) => m.item === it.item);
      const price = def ? def.price : 0;
      const subtotal = price * (it.qty || 1);
      total += subtotal;
      items.push({ ...it, price, subtotal, category: cat });
    }
  }
  let suggestion = '';
  const totalSoto = parsed.Soto.reduce((acc, cur) => acc + (cur.qty || 1), 0);
  const totalMinum = parsed.Minuman.reduce((acc, cur) => acc + (cur.qty || 1), 0);
  const totalPelengkap = parsed.Pelengkap.reduce((acc, cur) => acc + (cur.qty || 1), 0);

  if (totalSoto > 0 && totalMinum === 0) {
    suggestion = '💡 Rekomendasi Idzkar: Mau sekalian Es Teh Manis (Rp3.000) atau Jeruk Hangat (Rp4.000) agar makin segar?';
  } else if (totalSoto > 0 && totalPelengkap === 0) {
    suggestion = '💡 Rekomendasi Idzkar: Kuah sotonya makin mantap dipadukan Gorengan renyah (Rp1.000) atau Kerupuk (Rp1.000).';
  } else if (totalSoto >= 2 && totalMinum >= 2 && totalPelengkap === 0) {
    suggestion = '💡 Rekomendasi Idzkar: Tambah tusukan sate ati/puyuh (Rp3.000) atau pangsit (Rp1.500) untuk teman makan berdua?';
  }

  return { parsed, items, total, suggestion };
}

function buildOrderMessage(raw, schedule) {
  const clean = normalizeText(raw);
  const { items, total, suggestion, parsed } = calculateOrder(clean);
  const scheduleLine = schedule && schedule !== 'Hari ini' ? `Waktu Pemesanan: ${schedule}` : 'Waktu Pemesanan: Hari ini';
  if (items.length > 0) {
    const lines = ['Halo Soto Sore, saya mau pesan:'];
    lines.push(`📅 ${scheduleLine}`);
    lines.push('');
    for (const item of items) {
      const detail = [item.varian, item.catatan].filter(Boolean).join(', ');
      lines.push(`- ${item.qty}x ${item.item}${detail ? ` (${detail})` : ''} = Rp${item.subtotal.toLocaleString('id-ID')}`);
    }
    if (parsed.unknown_items && parsed.unknown_items.length > 0) {
      lines.push('');
      lines.push(`Catatan tambahan: ${parsed.unknown_items.join(', ')}`);
    }
    lines.push('');
    lines.push(`Estimasi Total: Rp${total.toLocaleString('id-ID')}`);
    lines.push('');
    lines.push('Mohon konfirmasi ketersediaan & total resminya ya. Terima kasih.');
    return {
      text: lines.join('\n'),
      total,
      suggestion,
      provider: 'local-structured'
    };
  }
  return {
    text: `Halo Soto Sore, saya mau tanya/pesan:\n📅 ${scheduleLine}\n\n${clean}\n\nMohon dibantu info ya. Terima kasih.`,
    total: 0,
    suggestion: '',
    provider: 'local-fallback'
  };
}

async function assistOrder(text, schedule) {
  const cleanInput = normalizeText(text);
  const { items, total, suggestion, parsed } = calculateOrder(cleanInput);
  const scheduleLine = schedule && schedule !== 'Hari ini' ? schedule : 'Hari ini';
  const key = process.env.GEMINI_API_KEY;
  if (key && items.length > 0) {
    const prompt = `Kamu Idzkar Soto Agent untuk warung Soto Sore Kalijambi.
Daftar pesanan terdeteksi:
${items.map(it => `- ${it.qty}x ${it.item} (Subtotal: Rp${it.subtotal})`).join('\n')}
Waktu Pengambilan / Pesanan: ${scheduleLine}
Estimasi hitungan total: Rp${total}
Rekomendasi sugesti menu: ${suggestion || 'Tidak ada'}
Pesan asli pelanggan:
${cleanInput}

Tugas:
1. Buat format pesan WhatsApp pemesanan yang rapi, sopan, dan hangat.
2. WAJIB cantumkan baris waktu pemesanan (contoh: "Waktu: ${scheduleLine}"). Jika hari ini, tuliskan "Waktu: Hari ini".
3. Cantumkan rincian item, jumlah, catatan/varian, serta cantumkan estimasi total: Rp${total.toLocaleString('id-ID')}.
4. Tuliskan 1 baris rekomendasi sugesti pelengkap/minuman jika ada.
5. Output HANYA teks bersih siap kirim ke WhatsApp tanpa markdown tebal berlebihan atau escape slash n.`;

    for (const model of ['gemini-2.5-flash', 'gemini-flash-latest']) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4500);
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`, {
          method: 'POST',
          signal: controller.signal,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.2, maxOutputTokens: 280 } })
        });
        clearTimeout(timeout);
        if (!response.ok) continue;
        const data = await response.json();
        const output = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();
        if (output) {
          const cleanOutput = normalizeText(output);
          return {
            text: cleanOutput.startsWith('Halo') ? cleanOutput : `Halo Soto Sore,\n\n${cleanOutput}`,
            total,
            suggestion,
            provider: `gemini:${model}`
          };
        }
      } catch {}
    }
  }
  return buildOrderMessage(cleanInput, schedule);
}

function staticFile(pathname) {
  const safe = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '').replace(/\.\.+/g, '');
  return new Response(Bun.file(new URL(safe, root)));
}

Bun.serve({ port, async fetch(req) {
  const url = new URL(req.url);
  if (url.pathname === '/api/health') return json({ status: 'ok' });
  if (url.pathname === '/api/orders/parse' && req.method === 'POST') {
    let body;
    try { body = await req.json(); } catch { return json({ error: 'Body JSON tidak valid.' }, 400); }
    if (typeof body.text !== 'string' || body.text.trim().length < 3 || body.text.length > 2000) return json({ error: 'Pesanan wajib berupa teks 3–2.000 karakter.' }, 400);
    return json(parseOrder(body.text));
  }
  if (url.pathname === '/api/orders/assist' && req.method === 'POST') {
    let body;
    try { body = await req.json(); } catch { return json({ error: 'Body JSON tidak valid.' }, 400); }
    if (typeof body.text !== 'string' || body.text.trim().length < 3 || body.text.length > 2000) return json({ error: 'Pesanan wajib berupa teks 3–2.000 karakter.' }, 400);
    try { return json(await assistOrder(body.text.trim(), body.schedule)); } catch (error) { return json({ error: 'AI sedang tidak tersedia.', detail: error.message }, 502); }
  }
  try { return staticFile(url.pathname); } catch { return new Response('Not found', { status: 404 }); }
}});
console.log(`Soto Sore running at http://localhost:${port}`);
