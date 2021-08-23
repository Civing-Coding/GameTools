 for %%i in (.\oldAudio\*.mp3) do ( 
    .\lame\lame.exe -h  --abr 64  %%i   .\newAudio\%%~ni.mp3 
)

 for %%i in (.\oldAudio\*.wav) do ( 
   .\lame\lame.exe  -h  %%i   .\newAudio\%%~ni.wav
)
@pause
