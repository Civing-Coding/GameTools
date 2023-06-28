"""
 * Python script to Resize Image.
 *
 * usage: python ImageResize.py <filename> <size>
"""

#!/usr/bin/env python3
# -*- coding: UTF-8 -*-

from PIL import Image, ImageFilter
import sys
import os
import os.path
import argparse
import re
import math

parser = argparse.ArgumentParser(description='manual to this script')
parser.add_argument('--path', type=str, default=None)
parser.add_argument('--outPath', type=str, default=None)
args = parser.parse_args()

path = args.path.replace("\\", "/")
outPath = args.outPath

print(path)


def ResizeTextureTO4(filePath, outpath):
    InImage = Image.open(u""+filePath)
    # InImage.show()
    basename = os.path.basename(filePath)
    imagename = os.path.splitext(basename)[0]
    suffix = os.path.splitext(basename)[1]

    old_width, old_height = InImage.size

    ws = int(old_width % 4)
    w = old_width + int((4-ws) if ws > 0 else 0)

    hs = int(old_height % 4)
    h = old_height + int((4-hs) if hs > 0 else 0)

    # Center the image

    x1 = int(math.floor((w - old_width)/2))

    y1 = int(math.floor((h - old_height)/2))

    mode = InImage.mode

    print('old_width:', old_width)
    print('old_height:', old_height)
    print('W:', w)
    print('h:', h)
    print('mode:', mode)

#    模式
# ------------------------------------------------
# 1             1位像素，黑和白，存成8位的像素
# L             8位像素，黑白
# P             8位像素，使用调色板映射到任何其他模式
# RGB           3×8位像素，真彩
# RGBA          4×8位像素，真彩+透明通道
# CMYK          4×8位像素，颜色隔离
# YCbCr         3×8位像素，彩色视频格式
# I             32位整型像素
# F             32位浮点型像素

    if len(mode) == 1:  # L, 1
        InImage = InImage.convert('RGBA')
        new_background = (255, 255, 255, 0)
        mode = 'RGBA'
    if len(mode) == 2:  # LA, 2
        InImage = InImage.convert('RGBA')
        new_background = (255, 255, 255, 0)
        mode = 'RGBA'
    if len(mode) == 3:  # RGB
        new_background = (255, 255, 255)
    if len(mode) == 4:  # RGBA, CMYK
        new_background = (255, 255, 255, 0)
    if len(mode) == 5:  # YCbCr
        new_background = (255, 255, 255)
        InImage = InImage.convert('RGB')
        mode = 'RGB'

    newsize = (w, h)
    #outImage = Image.new(mode, (old_width, old_height), new_background)
    #outImage.paste(InImage, (0, 0,  old_width, old_height))
    ##outImage.paste(InImage, (x1, y1, x1 + old_width, y1 + old_height))

    #outImage = outImage.resize(newsize, Image.BILINEAR)

    outImage = InImage.resize(newsize, resample=Image.ANTIALIAS)

    outImage.save(u""+outpath)

    InImage.close()
    outImage.close()
    sys.stdin.flush()


if outPath == None:
    outPath = path

pat = "(.*)\.(png||jpg)$"

if os.path.isfile(path):

    (parent_path, fileName) = os.path.split(path)
    # 进行匹配
    matchObj = re.match(pat, fileName)
    if matchObj != None:
        ResizeTextureTO4(path, outPath)
else:
    for root, dirs, files in os.walk(path):
        print('root_dir:', root)  # 当前目录路径
        print('sub_dirs:', dirs)  # 当前路径下所有子目录
        print('files:', files)  # 当前路径下所有非目录子文件

        for fileName in files:
            filePath = os.path.join(root, fileName).replace("\\", "/")
            fout = filePath.replace(path, outPath).replace("\\", "/")
            print("filePath "+filePath)
            print("outpath "+fout)
            # 进行匹配
            matchObj = re.match(pat, fileName)
            if matchObj != None:
                ResizeTextureTO4(filePath, fout)

print("ResizeTO4 Done")
