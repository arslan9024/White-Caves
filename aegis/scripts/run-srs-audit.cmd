@echo off
setlocal
cd /d "%~dp0..\.."
node aegis\scripts\srs-audit.js
