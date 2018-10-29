#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time : 2018/1/15 上午11:03
# @Author : Sui Chen
import random


def points_generate(num, m, n):
    res = set()
    while len(res) < num:
        while True:
            x = random.randint(1, n)
            y = random.randint(1, m)
            if (x,y) not in res:
                res.add((x, y))
                break
    return map(list, res)


print points_generate(5, 9, 9)