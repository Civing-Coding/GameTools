mkdir output
%~dp0ffmpeg.exe -i %1 -c:v libx264 -b:v 2000k -c:a aac -b:a 64k  output/%~n1.mp4 
@pause