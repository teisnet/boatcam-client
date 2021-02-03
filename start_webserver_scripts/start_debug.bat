@echo off
setlocal
echo.
echo  BOATCAM DEBUG MODE
echo.
echo ----------------------------------------------------------------
echo.

set NODE_ENV=development
rem set DEBUG=express:*
set DEBUG=boatcam:*
set PORT=3001
rem set CONFIG=./config/config.json

title BOATCAM WWW port: %PORT%, debug mode

pushd ..
node --debug=5858 ./bin/www
rem node --debug-brk=5858 ./bin/www
popd

cmd /k
endlocal
