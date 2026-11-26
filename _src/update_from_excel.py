"""
Studio Clayrity: turn site-content.xlsx (the client's product sheet) into data.js for the website.

    python _src/update_from_excel.py            check the sheet and write data.js
    python _src/update_from_excel.py --check    only check, change nothing

It also fills in a code (SC-123) for any new product row that has none, and saves it back into the sheet,
so each product keeps the same code (and shareable link) from then on.
"""
import hashlib
import io
import json
import re
import struct
import sys
import urllib.request
from pathlib import Path

from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parent.parent
XLSX = ROOT / "site-content.xlsx"
OUT = ROOT / "data.js"
IMAGES = ROOT / "images"
LINK_CACHE = Path(__file__).resolve().parent / "photo-links.json"  # link -> photo file already downloaded
MAX_SIDE = 1200  # photos are resized so their longest side is at most this many pixels


class PhotoError(Exception):
    pass


def is_link(value):
    return value.lower().startswith(("http://", "https://"))


def drive_file_id(url):
    """The file id inside a Google Drive share link (file/d/<id>/..., open?id=<id>, uc?id=<id>), or None."""
    m = re.search(r"/file/d/([\w-]{10,})", url) or re.search(r"[?&]id=([\w-]{10,})", url)
    return m.group(1) if m and "google." in url else None


def download(url):
    """Download a photo. Google Drive share links are turned into direct downloads."""
    fid = drive_file_id(url)
    if "drive.google." in url and "/folders/" in url:
        raise PhotoError("that's a link to a folder; open the photo itself and copy its link")
    tries = [f"https://drive.google.com/uc?export=download&id={fid}",
             f"https://drive.usercontent.google.com/download?id={fid}&export=download&confirm=t"] if fid else [url]
    for u in tries:
        req = urllib.request.Request(u, headers={"User-Agent": "StudioClayrityUpdater/1.0"})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                kind, data = r.headers.get("Content-Type", ""), r.read()
        except Exception as e:
            last = f"couldn't download it ({e})"
            continue
        if kind.startswith("image/") or data[:3] == b"\xff\xd8\xff" or data[:8] == b"\x89PNG\r\n\x1a\n" or data[8:12] in (b"WEBP", b"heic"):
            return data
        last = "the link didn't give a photo"
    if fid:
        raise PhotoError("Google Drive didn't share the photo. In Drive, set the photo (or its folder) to "
                         "'Anyone with the link can view', then copy the link again")
    raise PhotoError(last)


def save_web_photo(data, dest):
    """Turn the photo the right way up, shrink it for the web and save it as a JPEG."""
    try:
        from PIL import Image, ImageOps
    except ImportError:  # no image library: keep the original file
        dest.write_bytes(data)
        return "saved without resizing (the Pillow image library isn't installed)"
    try:
        im = ImageOps.exif_transpose(Image.open(io.BytesIO(data)))
    except Exception:
        raise PhotoError("the file isn't a photo the website can use (use JPG or PNG)")
    im = im.convert("RGB")
    im.thumbnail((MAX_SIDE, MAX_SIDE))
    im.save(dest, "JPEG", quality=84, optimize=True, progressive=True)
    return f"{im.width}x{im.height}" + ("  (small: a larger photo will look sharper)" if max(im.size) < 600 else "")


def fetch_photo(link, code, n, cache, notes):
    """Download a photo link once, save it in images/ named after the product, and return the file name."""
    if link in cache and (IMAGES / cache[link]).exists():
        return cache[link]
    name = f"sc-{code}-{n}-{hashlib.sha1(link.encode()).hexdigest()[:6]}.jpg"
    info = save_web_photo(download(link), IMAGES / name)
    cache[link] = name
    notes.append(f"downloaded photo {n} for SC-{code} as {name}, {info}")
    return name

# What the client picks in the "Collection" column -> the type the website uses, and the code range for new products
COLLECTIONS = {
    "Espresso cup": ("espresso", 100), "Cappuccino cup": ("cappuccino", 100), "Tea cup": ("tea", 100),
    "Tumbler": ("tumbler", 100), "Mug": ("mug", 100), "Chawan (bowl)": ("bowl", 100),
    "Gift set": ("sets", 200), "Lamp": ("lamp", 300), "Home decor": ("decor", 400), "Tableware": ("tableware", 500),
}
HEADERS = ["Code", "Show on site", "Name", "Collection", "Price (₹)", "Glaze / finish", "Details (size, capacity)",
           "Label", "Sold out", "One-of-a-kind no.", "Main photo", "Photo 2", "Photo 3", "Photo 4", "Description"]
HEADER_ROW = 3
SETTINGS = {"Shop name": "name", "WhatsApp number": "whatsapp", "Instagram handle": "instagram", "Top bar message": "announcement"}


def image_ratio(path):
    """Width/height of a JPEG or PNG, read from its header (no image library needed)."""
    data = path.read_bytes()
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        w, h = struct.unpack(">II", data[16:24])
        return f"{w}/{h}"
    i = 2
    while i < len(data) - 9:
        if data[i] != 0xFF:
            i += 1
            continue
        marker = data[i + 1]
        if marker in (0xC0, 0xC1, 0xC2):
            h, w = struct.unpack(">HH", data[i + 5:i + 9])
            return f"{w}/{h}"
        i += 2 + struct.unpack(">H", data[i + 2:i + 4])[0]
    return None


def text(v):
    return "" if v is None else str(v).strip()


def main(check_only=False):
    if not XLSX.exists():
        sys.exit(f"Can't find {XLSX.name} in the project folder.")
    wb = load_workbook(XLSX)
    ws = wb["Products"]
    cols = {text(c.value): c.column for c in ws[HEADER_ROW]}
    missing = [h for h in HEADERS if h not in cols]
    if missing:
        sys.exit(f"The Products sheet is missing these column headings: {', '.join(missing)}")

    problems, warnings, products, descriptions = [], [], [], {}
    link_cache = json.loads(LINK_CACHE.read_text(encoding="utf-8")) if LINK_CACHE.exists() else {}
    used = {}
    rows = []
    for r in range(HEADER_ROW + 1, ws.max_row + 1):
        get = lambda h: ws.cell(row=r, column=cols[h]).value
        if not any(text(get(h)) for h in HEADERS if h != "Code"):
            continue  # empty row
        rows.append(r)
        code = text(get("Code")).upper().replace("SC-", "")
        if code:
            if not code.isdigit():
                problems.append(f"Row {r}: the code '{get('Code')}' should look like SC-123.")
            elif code in used:
                problems.append(f"Row {r}: code SC-{code} is used twice (also row {used[code]}).")
            else:
                used[code] = r

    for r in rows:
        get = lambda h: ws.cell(row=r, column=cols[h]).value
        name, coll = text(get("Name")), text(get("Collection"))
        if text(get("Show on site")).lower() == "no":
            continue
        if not name:
            problems.append(f"Row {r}: the product needs a name.")
            continue
        if coll not in COLLECTIONS:
            problems.append(f"Row {r} ({name}): pick a Collection from the list (now '{coll}').")
            continue
        ptype, base = COLLECTIONS[coll]
        try:
            price = int(round(float(str(get("Price (₹)")).replace(",", "").replace("₹", ""))))
            if price <= 0:
                raise ValueError
        except (TypeError, ValueError):
            problems.append(f"Row {r} ({name}): the price should be a number, like 950.")
            continue

        code = text(get("Code")).upper().replace("SC-", "")
        if not code:  # new product: next free code in its collection's range
            n = base + 1
            while str(n) in used:
                n += 1
            code = str(n)
            used[code] = r
            ws.cell(row=r, column=cols["Code"], value=f"SC-{code}")
            warnings.append(f"Row {r} ({name}): new product, given code SC-{code}.")

        photos = [text(get(h)) for h in ("Main photo", "Photo 2", "Photo 3", "Photo 4")]
        photos = [p for p in photos if p]
        if not photos:
            problems.append(f"Row {r} ({name}): add the main photo (a Google Drive link or a file name).")
            continue
        resolved, bad = [], False
        for n, p in enumerate(photos, start=1):
            if is_link(p):
                if check_only:
                    resolved.append(None)  # links are only downloaded when updating
                    continue
                try:
                    resolved.append(fetch_photo(p, code, n, link_cache, warnings))
                except PhotoError as e:
                    problems.append(f"Row {r} ({name}), photo {n}: {e}.")
                    bad = True
            elif (IMAGES / p).exists():
                resolved.append(p)
            else:
                problems.append(f"Row {r} ({name}): there is no photo called '{p}' in the images folder.")
                bad = True
        if bad:
            continue
        if check_only and None in resolved:
            products.append({})  # counted; its photo is measured when the update downloads it
            continue
        photos = resolved

        item = {"id": int(code), "name": name, "type": ptype, "price": price}
        for key, h in (("glaze", "Glaze / finish"), ("size", "Details (size, capacity)")):
            if text(get(h)):
                item[key] = text(get(h))
        item["img"] = photos[0]
        if len(photos) > 1:
            item["gallery"] = photos
        label = text(get("Label"))
        if label in ("New", "Bestseller"):
            item["badge"] = label
        if text(get("Sold out")).lower() == "yes":
            item["soldOut"] = True
        if text(get("One-of-a-kind no.")):
            try:
                item["no"] = int(float(text(get("One-of-a-kind no."))))
            except ValueError:
                warnings.append(f"Row {r} ({name}): the one-of-a-kind number should be a number; left it out.")
        ratio = image_ratio(IMAGES / photos[0])
        if ratio:
            item["ar"] = ratio
        products.append(item)
        if text(get("Description")):
            descriptions[item["id"]] = text(get("Description"))
        else:
            warnings.append(f"Row {r} ({name}): no description yet.")

    sws = wb["Shop settings"]
    shop = {"name": "Studio Clayrity", "whatsapp": "", "instagram": "", "announcement": ""}
    for row in sws.iter_rows(min_row=1, max_col=2):
        label, value = text(row[0].value), text(row[1].value)
        if label in SETTINGS:
            shop[SETTINGS[label]] = value
    shop["whatsapp"] = "".join(ch for ch in shop["whatsapp"] if ch.isdigit())
    shop["instagram"] = shop["instagram"].lstrip("@")
    if len(shop["whatsapp"]) < 10:
        problems.append("Shop settings: the WhatsApp number should include the country code, e.g. 919876543210.")

    if link_cache and not check_only:
        LINK_CACHE.write_text(json.dumps(link_cache, indent=1), encoding="utf-8")  # remember downloads, even if a later row has a problem
    for w in warnings:
        print("  note:", w)
    if problems:
        print("\nPlease fix these in site-content.xlsx, then run the update again:")
        for p in problems:
            print("  -", p)
        sys.exit(1)

    if check_only:
        print(f"\nThe sheet looks good: {len(products)} products ready.")
        return
    if any("given code" in w for w in warnings):
        try:
            wb.save(XLSX)  # keep the new codes in the sheet
        except PermissionError:
            sys.exit("\nsite-content.xlsx is open in Excel, so the new product codes can't be saved into it.\n"
                     "Close the file in Excel and run the update again.")
    js = [
        "// GENERATED from site-content.xlsx by _src/update_from_excel.py.",
        "// To change products, prices or shop details, edit site-content.xlsx and run the update, not this file.",
        f"const SHOP = {json.dumps(shop, ensure_ascii=False)};",
        "const PRODUCTS = [",
        *[f"  {json.dumps(p, ensure_ascii=False)}," for p in products],
        "];",
        "const DESCRIPTIONS = {",
        *[f"  {k}: {json.dumps(v, ensure_ascii=False)}," for k, v in descriptions.items()],
        "};",
        "",
    ]
    OUT.write_text("\n".join(js), encoding="utf-8")
    print(f"\nUpdated data.js: {len(products)} products on the site.")


if __name__ == "__main__":
    main(check_only="--check" in sys.argv)
