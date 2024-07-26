mkdir output
%~dp0ffmpeg.exe -i %1 -vcodec copy -an output/%~n1.mp4 
@pause
