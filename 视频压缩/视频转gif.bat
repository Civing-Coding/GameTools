mkdir output
%~dp0ffmpeg.exe -i %1 -r 12 output/%~n1.gif
@pause