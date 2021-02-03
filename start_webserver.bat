@echo off
setlocal
echo.
echo  BOATCAM RELEASE MODE
echo.
echo ----------------------------------------------------------------
echo.

set NODE_ENV=development
REM set DEBUG=express:*
set DEBUG=boatcam:*
set PORT=3001
rem set CONFIG=./config/config.json

title BOATCAM port: %PORT%, release mode

rem pushd ..
node ./bin/www
rem popd

cmd /k
endlocal
