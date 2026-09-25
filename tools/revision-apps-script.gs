/**
 * Backend de revision.html sobre Google Sheets (Apps Script).
 *
 * Instalación:
 *   1. Crea una hoja de cálculo en Google Drive (p. ej. "Revisión web Suhevic").
 *   2. Extensiones → Apps Script. Borra lo que haya y pega este archivo.
 *   3. Rellena NOTIFY_EMAIL. TOKEN debe coincidir con API_KEY de revision.html.
 *   4. Implementar → Nueva implementación → Tipo: Aplicación web.
 *        Ejecutar como: Yo · Quién tiene acceso: Cualquier usuario.
 *      Autoriza los permisos y copia la URL (acaba en /exec).
 *   5. Pega esa URL en API_URL dentro de revision.html.
 *
 * Hojas que crea solo:
 *   - "Respuestas": una fila por elemento, siempre actualizada.
 *   - "Historial": una fila cada vez que el cliente pulsa "Enviar lo revisado".
 *   - "_estado": copia completa en JSON para restaurar el progreso (no tocar).
 */

const TOKEN = "_NZesm-r7uIbAlAVtIw9vP9_";
const NOTIFY_EMAIL = ""; // tu email: aquí llegan los avisos de cada envío

const CHUNK = 40000; // límite de caracteres por celda ≈ 50.000

function doGet(e) {
  if (e.parameter.k !== TOKEN) return json_({ ok: false, error: "forbidden" });
  const sh = sheet_("_estado");
  const last = sh.getLastRow();
  if (!last) return json_({ ok: true, state: null });
  const raw = sh.getRange(1, 1, last, 1).getValues().map((r) => r[0]).join("");
  return json_({ ok: true, state: raw ? JSON.parse(raw) : null });
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents || "{}");
  if (body.k !== TOKEN) return json_({ ok: false, error: "forbidden" });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    if (body.action === "save") {
      saveState_(body.state);
      writeRows_(body.rows || []);
      return json_({ ok: true, savedAt: new Date().toISOString() });
    }
    if (body.action === "notify") {
      const h = sheet_("Historial");
      if (!h.getLastRow()) {
        h.appendRow(["Fecha", "Revisado por", "Resumen"]);
        h.getRange(1, 1, 1, 3).setFontWeight("bold");
        h.setFrozenRows(1);
        h.setColumnWidth(3, 700);
      }
      h.appendRow([new Date(), body.reviewer || "", body.summary || ""]);
      if (NOTIFY_EMAIL) {
        MailApp.sendEmail({
          to: NOTIFY_EMAIL,
          subject: "Revisión web Suhevic · nuevo envío" + (body.reviewer ? " de " + body.reviewer : ""),
          body: (body.summary || "") + "\n\nHoja completa: " + SpreadsheetApp.getActive().getUrl(),
        });
      }
      return json_({ ok: true });
    }
    return json_({ ok: false, error: "unknown action" });
  } finally {
    lock.releaseLock();
  }
}

function saveState_(state) {
  const sh = sheet_("_estado");
  const raw = JSON.stringify(state || {});
  const chunks = [];
  for (let i = 0; i < raw.length; i += CHUNK) chunks.push([raw.slice(i, i + CHUNK)]);
  sh.clear();
  if (chunks.length) sh.getRange(1, 1, chunks.length, 1).setValues(chunks);
  sh.hideSheet();
}

function writeRows_(rows) {
  const sh = sheet_("Respuestas");
  const header = ["Código", "Sección", "Elemento", "Estado", "Cambios pedidos", "Comentario", "Actualizado"];
  sh.clear();
  sh.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight("bold");
  sh.setFrozenRows(1);
  if (rows.length) {
    const now = new Date();
    const data = rows.map((r) => [r[0], r[1], r[2], r[3], r[4], r[5], r[6] ? new Date(r[6]) : now]);
    sh.getRange(2, 1, data.length, header.length).setValues(data).setWrap(true).setVerticalAlignment("top");
    // Colores por estado
    const colors = data.map((r) => {
      const c = r[3] === "Cambiar" ? "#fbe3e1" : r[3] === "Está bien" ? "#e3f2e8" : r[3] === "Respondido" ? "#e8eefb" : "#ffffff";
      return Array(header.length).fill(c);
    });
    sh.getRange(2, 1, data.length, header.length).setBackgrounds(colors);
  }
  sh.setColumnWidth(1, 60);
  sh.setColumnWidth(3, 220);
  sh.setColumnWidth(5, 420);
  sh.setColumnWidth(6, 260);
}

function sheet_(name) {
  const ss = SpreadsheetApp.getActive();
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
