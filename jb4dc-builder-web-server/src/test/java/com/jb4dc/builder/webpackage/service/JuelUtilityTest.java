package com.jb4dc.builder.webpackage.service;

import com.jb4dc.workflow.utility.JuelUtility;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

public class JuelUtilityTest {
    @Test
    public void getHasAuthorityAppSSO() {
        //System.out.println(JuelUtility.demo1());
        //System.out.println(JuelUtility.demo2());
        Map<String,Object> __$vars$=new HashMap<>();
        __$vars$.put("__$FlowVar$$ModelName$","1__$var2$");
        __$vars$.put("__$FlowVar$$InstanceCreator$","2__$var2$");
        __$vars$.put("__$FlowVar$$InstanceCreatorOrganName$","2__$var2$");
        __$vars$.put("__$roles$","r2r1");
        __$vars$.put("__$LastAction$","@[FlowAction.StartEvent_N1.action_515976189]");
        System.out.println(JuelUtility.buildStringExpression(null,"${__$FlowVar$$ModelName$}-【${__$FlowVar$$InstanceCreator$}】-「${__$FlowVar$$InstanceCreatorOrganName$}」",__$vars$).getStringResult());

        System.out.println(JuelUtility.buildBoolExpression(null,"${__$LastAction$==\"@[FlowAction.StartEvent_N1.action_515976189]\"}",__$vars$).getBooleanResult());

        System.out.println(JuelUtility.buildBoolExpression(null,"${__$roles$.contains(\"r1\") or __$roles$.contains(\"2r\")}",__$vars$).getBooleanResult());
    }
}
