/**
 * Studio Clayrity product sheet: gives each new product its code (SC-123) as soon as its row has a
 * Name and a Collection, so the product keeps the same code and shareable link for good.
 *
 * One-time setup, in the Google Sheet: Extensions → Apps Script → replace everything with this file → Save.
 * Nothing to authorise: it runs by itself whenever the sheet is edited.
 */
var HEADER_ROW = 3;
var CODE_FROM = { // Collection -> first code number of its range (same as COLLECTIONS in update_from_excel.py)
  "Espresso cup": 100, "Cappuccino cup": 100, "Tea cup": 100, "Tumbler": 100, "Mug": 100, "Chawan (bowl)": 100,
  "Gift set": 200, "Lamp": 300, "Home decor": 400, "Tableware": 500
};

function onEdit(e) {
  var sheet = e.range.getSheet();
  if (sheet.getName() !== "Products" || e.range.getLastRow() <= HEADER_ROW) return;

  var headers = sheet.getRange(HEADER_ROW, 1, 1, sheet.getLastColumn()).getValues()[0];
  var col = function (name) { return headers.indexOf(name); };
  var cCode = col("Code"), cName = col("Name"), cColl = col("Collection");
  if (cCode < 0 || cName < 0 || cColl < 0) return;

  var first = HEADER_ROW + 1, count = sheet.getLastRow() - HEADER_ROW;
  if (count < 1) return;
  var rows = sheet.getRange(first, 1, count, headers.length).getValues();

  var used = {};
  rows.forEach(function (r) {
    var n = String(r[cCode]).toUpperCase().replace("SC-", "").trim();
    if (/^\d+$/.test(n)) used[n] = true;
  });

  for (var i = Math.max(0, e.range.getRow() - first); i <= Math.min(count - 1, e.range.getLastRow() - first); i++) {
    var r = rows[i];
    var base = CODE_FROM[String(r[cColl]).trim()];
    if (String(r[cCode]).trim() || !String(r[cName]).trim() || base === undefined) continue;
    var n = base + 1;
    while (used[String(n)]) n++;
    used[String(n)] = true;
    sheet.getRange(first + i, cCode + 1).setValue("SC-" + n);
  }
}
