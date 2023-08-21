mkdir output
%~dp0ffmpeg.exe -i %1 -vf scale=1280:368 -vcodec libvpx -acodec libvorbis -q:a 7  output/%~n1.webm
@pause