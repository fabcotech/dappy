set "TARGET=" || set "TARGET=dappy"
set "PLATFORM=" || set "PLATFORM=windows:32"

call npm ci
call npm run build:all:prod
call npm run package:%TARGET%:%PLATFORM%