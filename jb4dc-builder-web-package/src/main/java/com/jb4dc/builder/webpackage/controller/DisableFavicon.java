package com.jb4dc.builder.webpackage.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/1
 * To change this template use File | Settings | File Templates.
 */
@Controller
public class DisableFavicon {
    @GetMapping("favicon.ico")
    @ResponseBody
    public void disableFavicon() {
        System.out.println("收藏图片!");
    }
}
