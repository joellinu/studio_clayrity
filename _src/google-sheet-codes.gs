/**
 * Studio Clayrity product sheet.
 *  1. Gives each new product its code (SC-123) as soon as its row has a Name and a Collection,
 *     so the product keeps the same code and shareable link for good.
 *  2. Publishes the website about 2 minutes after the last edit, and adds a "Website → Publish now" menu.
 *     It does this by asking GitHub to run the "Update from Google Sheet" job.
 *
 * One-time setup, in the Google Sheet:
 *   Extensions → Apps Script → replace everything with this file → Save.
 *   Reload the sheet, then Website → Set up publishing (one time), paste the GitHub key, and Allow.
 */
var HEADER_ROW = 3;
var CODE_FROM = { // Collection -> first code number of its range (same as COLLECTIONS in update_from_excel.py)
  "Espresso cup": 100, "Cappuccino cup": 100, "Tea cup": 100, "Tumbler": 100, "Mug": 100, "Chawan (bowl)": 100,
  "Gift set": 200, "Lamp": 300, "Home decor": 400, "Tableware": 500
};
var REPO = "joellinu/studio_clayrity";
var WORKFLOW = "update-from-sheet.yml";
var WAIT_MINUTES = 2; // publish this long after the last edit, so a batch of edits goes out together
var STATUS_PAGE = "https://studioclayrity.com/update-status.html";

function onOpen() {
  SpreadsheetApp.getUi().createMenu("Website")
    .addItem("Publish now", "publishNow")
    .addItem("Open the update status page", "showStatusLink")
    .addSeparator()
    .addItem("Set up publishing (one time)", "setUpPublishing")
    .addToUi();
}

function onEdit(e) {
  var sheet = e.range.getSheet();
  var name = sheet.getName();
  if (name === "Products" || name === "Shop settings") {
    PropertiesService.getScriptProperties().setProperty("lastEdit", String(Date.now()));
  }
  if (name === "Products" && e.range.getLastRow() > HEADER_ROW) fillCodes(sheet, e.range);
}

function fillCodes(sheet, range) {
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

  for (var i = Math.max(0, range.getRow() - first); i <= Math.min(count - 1, range.getLastRow() - first); i++) {
    var r = rows[i];
    var base = CODE_FROM[String(r[cColl]).trim()];
    if (String(r[cCode]).trim() || !String(r[cName]).trim() || base === undefined) continue;
    var n = base + 1;
    while (used[String(n)]) n++;
    used[String(n)] = true;
    sheet.getRange(first + i, cCode + 1).setValue("SC-" + n);
  }
}

/** Website → Set up publishing: store the GitHub key and start the every-minute check. */
function setUpPublishing() {
  var ui = SpreadsheetApp.getUi();
  var answer = ui.prompt("Set up publishing",
    "Paste the GitHub key (it starts with github_pat_). It can only start website updates for this shop.",
    ui.ButtonSet.OK_CANCEL);
  if (answer.getSelectedButton() !== ui.Button.OK) return;
  var key = answer.getResponseText().trim();
  if (!/^(github_pat_|ghp_)/.test(key)) { ui.alert("That doesn't look like a GitHub key. Nothing was changed."); return; }

  var props = PropertiesService.getScriptProperties();
  props.setProperty("githubKey", key);
  var test = startUpdate();
  if (!test.ok) { ui.alert("GitHub didn't accept the key: " + test.message); return; }

  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "publishIfEdited") ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger("publishIfEdited").timeBased().everyMinutes(1).create();
  props.setProperty("lastPublish", String(Date.now()));
  ui.alert("Publishing is set up. From now on the website updates about " + WAIT_MINUTES +
    " minutes after the last change in this sheet. (A first update has just been started.)");
}

/** Runs every minute: publish once the sheet has been quiet for WAIT_MINUTES after an edit. */
function publishIfEdited() {
  var props = PropertiesService.getScriptProperties();
  var lastEdit = Number(props.getProperty("lastEdit") || 0);
  var lastPublish = Number(props.getProperty("lastPublish") || 0);
  if (lastEdit <= lastPublish || Date.now() - lastEdit < WAIT_MINUTES * 60 * 1000) return;
  if (startUpdate().ok) props.setProperty("lastPublish", String(Date.now()));
}

/** Website → Publish now */
function publishNow() {
  var res = startUpdate();
  if (res.ok) {
    PropertiesService.getScriptProperties().setProperty("lastPublish", String(Date.now()));
    SpreadsheetApp.getActive().toast("The website will show your changes in about 2 minutes.", "Publishing", 8);
  } else {
    SpreadsheetApp.getUi().alert("Couldn't publish: " + res.message);
  }
}

function showStatusLink() {
  var html = HtmlService.createHtmlOutput('<p style="font-family:Arial">Open <a href="' + STATUS_PAGE +
    '" target="_blank">the update status page</a> to see if your last change is live, or which row to fix.</p>')
    .setWidth(360).setHeight(90);
  SpreadsheetApp.getUi().showModalDialog(html, "Website update status");
}

function startUpdate() {
  var key = PropertiesService.getScriptProperties().getProperty("githubKey");
  if (!key) return { ok: false, message: "publishing isn't set up yet (Website → Set up publishing)." };
  var res = UrlFetchApp.fetch("https://api.github.com/repos/" + REPO + "/actions/workflows/" + WORKFLOW + "/dispatches", {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + key, Accept: "application/vnd.github+json" },
    payload: JSON.stringify({ ref: "main" }),
    muteHttpExceptions: true
  });
  var code = res.getResponseCode();
  if (code === 204) return { ok: true };
  if (code === 401) return { ok: false, message: "the GitHub key is wrong or has expired. Make a new one and run Set up publishing again." };
  if (code === 403 || code === 404) return { ok: false, message: "the GitHub key doesn't have permission (it needs Actions: Read and write on studio_clayrity)." };
  return { ok: false, message: "GitHub answered " + code + "." };
}
