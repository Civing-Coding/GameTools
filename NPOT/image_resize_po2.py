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

sizes = [2, 4, 8, 16, 32, 64, 128, 256, 512,
         1024, 2048, 4096, 8192]  # po2 sizes


def get_closest(y):
    """ Return the closest power of 2 in either direction"""
    return min(sizes, key=lambda x: abs(x - y))


def po2(im, threshold=0.25):
    """ 
    Return a resized image that is a power of 2 
    (Checking that if image size is reduced it was fairly close to that size anyway based on threshold)
    """
    width, height = im.size
    largest_dim = max(width, height)
    new_x = get_closest(width)
    new_y = get_closest(height)
    max_size = get_closest(largest_dim)

    if new_x < width:
        if (width - new_x) > int(new_x * threshold):
            new_x = sizes[sizes.index(new_x) + 1]

    if new_y < height:
        if (height - new_y) > int(new_y * threshold):
            new_y = sizes[sizes.index(new_y) + 1]

    return im.resize((new_x, new_y), resample=Image.LANCZOS)

    # new_dim = max(new_x, new_y)  # new dimension will be largest of x or y po2

    # if new_dim < largest_dim:  # if it's smaller, make sure its within threshold
    #     if (largest_dim - new_dim) > int(new_dim * threshold):
    #         new_dim = sizes[sizes.index(new_dim) + 1]
    #         return im.resize((new_x, new_y), resample=Image.BICUBIC)
    #     else:
    #         return im.resize((new_x, new_y), resample=Image.LANCZOS)
    # else:
    #     return im.resize((new_x, new_y), resample=Image.BICUBIC)


parser = argparse.ArgumentParser(description='manual to this script')
parser.add_argument('--path', type=str, default=None)
parser.add_argument('--outPath', type=str, default=None)
args = parser.parse_args()

path = args.path.replace("\\", "/")
outPath = args.outPath

print(path)


def ResizeTexturePOT(filePath, outpath, threshold=0.5, compression=0):
    InImage = Image.open(u""+filePath)
    # InImage.show()
    basename = os.path.basename(filePath)
    imagename = os.path.splitext(basename)[0]
    suffix = os.path.splitext(basename)[1]

    old_width, old_height = InImage.size
    mode = InImage.mode

    print('old_width:', old_width)
    print('old_height:', old_height)
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
    if len(mode) == 3:  # RGB
        new_background = (255, 255, 255)
    if len(mode) == 4:  # RGBA, CMYK
        new_background = (255, 255, 255, 0)

    outImage = po2(InImage, threshold)
    # outImage = Image.new(mode, (w, h), new_background)
    # outImage.paste(InImage, (x1, y1, x1 + old_width, y1 + old_height))
    outImage.save(u""+outpath, InImage.format)

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
        ResizeTexturePOT(path, outPath)
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
                ResizeTexturePOT(filePath, fout)

print("ResizeNPOT Done")
