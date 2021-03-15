package com.jb4dc.builder.webpackage.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
@RequestMapping(value = "/Controller")
public class IndexController {
    @RequestMapping(value = "/Index", method = RequestMethod.GET)
    public void index(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.sendRedirect("../HTML/FrameV2/FrameView.html");
    }
}
