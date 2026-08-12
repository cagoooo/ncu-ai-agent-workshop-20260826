const Workshop = (() => {
  const download = (name, content, type = "text/plain;charset=utf-8") => {
    const blob = content instanceof Blob ? content : new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const copy = async (text, button) => {
    await navigator.clipboard.writeText(text);
    if (button) {
      const before = button.textContent;
      button.textContent = "已複製";
      setTimeout(() => button.textContent = before, 1300);
    }
  };

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

  const csvCell = (value) => {
    const s = String(value ?? "");
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const toCsv = (rows, columns) => {
    const cols = columns || Object.keys(rows[0] || {});
    return "\uFEFF" + [cols.join(","), ...rows.map(r => cols.map(c => csvCell(r[c])).join(","))].join("\r\n");
  };

  const parseCsv = (text) => {
    const rows = [];
    let row = [], cell = "", quoted = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (quoted) {
        if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
        else if (ch === '"') quoted = false;
        else cell += ch;
      } else if (ch === '"') quoted = true;
      else if (ch === ',') { row.push(cell); cell = ""; }
      else if (ch === '\n') { row.push(cell.replace(/\r$/, "")); rows.push(row); row = []; cell = ""; }
      else cell += ch;
    }
    if (cell.length || row.length) { row.push(cell.replace(/\r$/, "")); rows.push(row); }
    const headers = (rows.shift() || []).map(h => h.trim().replace(/^\uFEFF/, ""));
    return rows.filter(r => r.some(v => v !== "")).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""])));
  };

  const crcTable = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c >>> 0;
    }
    return table;
  })();
  const crc32 = bytes => {
    let crc = 0xffffffff;
    for (const b of bytes) crc = crcTable[(crc ^ b) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  };
  const u16 = n => [n & 255, (n >>> 8) & 255];
  const u32 = n => [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255];
  const zipStore = (files) => {
    const enc = new TextEncoder();
    const locals = [], centrals = [];
    let offset = 0;
    Object.entries(files).forEach(([name, content]) => {
      const nameBytes = enc.encode(name.replace(/\\/g, "/"));
      const data = content instanceof Uint8Array ? content : content instanceof ArrayBuffer ? new Uint8Array(content) : enc.encode(content);
      const crc = crc32(data);
      const local = new Uint8Array([
        ...u32(0x04034b50), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0),
        ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(nameBytes.length), ...u16(0),
        ...nameBytes, ...data
      ]);
      locals.push(local);
      const central = new Uint8Array([
        ...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0),
        ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(nameBytes.length), ...u16(0), ...u16(0),
        ...u16(0), ...u16(0), ...u32(0), ...u32(offset), ...nameBytes
      ]);
      centrals.push(central);
      offset += local.length;
    });
    const centralSize = centrals.reduce((n, a) => n + a.length, 0);
    const end = new Uint8Array([
      ...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(centrals.length), ...u16(centrals.length),
      ...u32(centralSize), ...u32(offset), ...u16(0)
    ]);
    return new Blob([...locals, ...centrals, end], { type: "application/zip" });
  };

  return { download, copy, esc, toCsv, parseCsv, zipStore };
})();
