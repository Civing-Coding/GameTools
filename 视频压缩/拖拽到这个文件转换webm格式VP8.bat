mkdir output
%~dp0ffmpeg.exe -i %1 -vcodec libvpx -b:v 8000k  -acodec libvorbis -q:a 7  output/%~n1.webm
@pause