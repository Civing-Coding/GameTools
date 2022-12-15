@echo off
set path=%~dp0

if exist %1\. (
    for /r %1  %%i in (*.jpg,*.png,*.jpeg) do (
        @REM quality 0-255
        bin\crunch_x64.exe -file %%i -outdir %%~dpi -fileformat dds -ETC2
        echo %%i
    )
) else (
    @REM quality 0-255
    bin\crunch_x64.exe -file %1 -outdir %%~dp1 -fileformat dds -dxt5 -quality 128 -mipmode none -lzmastats
    @REM del %1
)

pause
