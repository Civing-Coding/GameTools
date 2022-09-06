@echo off
set path=%~dp0

if exist %1\. (
    for /r %1  %%i in (*.jpg,*.png,*.jpeg) do (
        astcenc-avx2.exe -cl %%i %%~dpni.astc  4x4 -medium
        del %%i
    )
) else (
    astcenc-avx2.exe -cl %1 %~dpn1.astc  4x4 -medium
    del %1
)

pause
