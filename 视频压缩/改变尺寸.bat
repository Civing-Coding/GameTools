mkdir output
%~dp0ffmpeg.exe -i %1 -c:v libx264 -b:v 2000k -vf scale=1920:1200  -c:a aac -b:a 192k  output/%~n1.mp4 
@pause