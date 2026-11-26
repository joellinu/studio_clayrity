@echo off
rem Studio Clayrity: publish the Google Sheet now, instead of waiting for the automatic update (every 10 minutes).
cd /d "%~dp0"
set GIT="C:\Program Files\Git\cmd\git.exe"
set GCM_INTERACTIVE=never

%GIT% pull -q --rebase origin main
echo.
echo  Reading the Google Sheet ...
echo.
python _src\update_from_excel.py --google
if errorlevel 1 (
  echo.
  echo  Nothing was published. Fix the rows listed above in the Google Sheet, and run this again.
  echo.
  pause
  exit /b 1
)

%GIT% add data.js images _src\photo-links.json update-status.html
%GIT% diff --cached --quiet -- data.js
if errorlevel 1 (%GIT% add site-content.xlsx) else (%GIT% checkout -- site-content.xlsx)
%GIT% diff --cached --quiet
if not errorlevel 1 (
  echo.
  echo  No changes to publish: the website already matches the sheet.
  echo.
  pause
  exit /b 0
)

%GIT% commit -q -m "Update from the Google Sheet"
%GIT% push -q origin main
if errorlevel 1 (
  echo.
  echo  The changes are saved on this computer but couldn't be published. Check the internet connection and try again.
  echo.
  pause
  exit /b 1
)

echo.
echo  Published. The live site updates in about a minute:
echo  https://studioclayrity.com/
echo.
pause
