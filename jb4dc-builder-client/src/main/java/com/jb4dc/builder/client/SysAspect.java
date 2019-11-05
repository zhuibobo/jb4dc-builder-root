package com.jb4dc.builder.client;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/5
 * To change this template use File | Settings | File Templates.
 */
@Order(100)
@Aspect
@Component
public class SysAspect {
    @Pointcut("execution(public * com.jb4dc.builder.client.service.webform.impl.*.*(..))")
    public void log(){}

    private static final Logger logger = LoggerFactory.getLogger(SysAspect.class);

    //统计请求的处理时间
    ThreadLocal<Long> startTime = new ThreadLocal<>();

    @Before("log()")
    public void doBefore(JoinPoint joinPoint) throws Throwable{
        startTime.set(System.currentTimeMillis());
        //接收到请求，记录请求内容
        //ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        //HttpServletRequest request = attributes.getRequest();
        //记录请求的内容
        //System.out.println("Aspect_URL:"+request.getRequestURL().toString());
        //System.out.println("Aspect_Method:"+request.getMethod());
    }

    @AfterReturning(returning = "ret" , pointcut = "log()")
    public void doAfterReturning(Object ret){
        //处理完请求后，返回内容
        System.out.println("方法执行时间:"+ (System.currentTimeMillis() - startTime.get()));
    }

}
