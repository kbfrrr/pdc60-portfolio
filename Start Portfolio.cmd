@echo off
setlocal
pushd "%~dp0" || exit /b 1
powershell.exe -NoProfile -Command "$ErrorActionPreference = 'Stop'; $url = 'http://127.0.0.1:4173/'; function Test-Portfolio { try { $response = Invoke-WebRequest -Uri $url -Method Head -UseBasicParsing -TimeoutSec 1; $response.StatusCode -eq 200 -and $response.Headers['X-PDC60-Portfolio'] -eq 'local' } catch { $false } }; if (-not (Test-Portfolio)) { $server = Start-Process -FilePath (Get-Command node.exe).Source -ArgumentList 'serve-local.cjs' -WorkingDirectory (Get-Location).Path -WindowStyle Hidden -PassThru; for ($attempt = 0; $attempt -lt 20; $attempt++) { if (Test-Portfolio) { exit 0 }; if ($server.HasExited) { break }; Start-Sleep -Milliseconds 150 }; throw 'Could not start the local portfolio. Make sure Node.js is installed and port 4173 is available.' }"
if errorlevel 1 (
  pause
  popd
  exit /b 1
)
start "" "http://127.0.0.1:4173/"
popd
