mkdir output
ffmpeg.exe -i 1.mp4 -r 12 -f image2 output/%03d.png
@pause