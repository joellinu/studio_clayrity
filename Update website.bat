@echo off
rem Studio Clayrity: publish the changes made in site-content.xlsx.
rem Double-click this file. It checks the sheet, updates the site's product data and publishes it.
cd /d "%~dp0"
set GIT="C:\Program Files\Git\cmd\git.exe"
set GCM_INTERACTIVE=never

echo.
echo  Checking site-content.xlsx ...
echo.
python _src\update_from_excel.py
if errorlevel 1 (
  echo.
  echo  Nothing was published. Fix the rows listed above, save the sheet, and run this again.
  echo.
  pause
  exit /b 1
)

%GIT% add data.js site-content.xlsx images
%GIT% diff --cached --quiet
if not errorlevel 1 (
  echo.
  echo  No changes to publish: the website already matches the sheet.
  echo.
  pause
  exit /b 0
)

%GIT% commit -q -m "Update products from site-content.xlsx"
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
echo  https://joellinu.github.io/studio_clayrity/
echo.
pause
