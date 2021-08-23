 for %%i in (.\oldVideo\*.mp4) do ( 
    .\ffmpeg.exe -i  %%i  -b:v 600k -b:a 64k -r 24   .\newVideo\%%~ni.mp4 
)
@pause