package com.jb4dc.workflow.utility;

import de.odysseus.el.ExpressionFactoryImpl;
import de.odysseus.el.util.SimpleContext;

import javax.el.ExpressionFactory;
import javax.el.ValueExpression;

public class JuelUtility {
    public static String demo1() {
        ExpressionFactory factory = new ExpressionFactoryImpl();
        SimpleContext context = new SimpleContext();

        //step2
        context.setVariable("var1", factory.createValueExpression("Hello", String.class));
        context.setVariable("var2", factory.createValueExpression("World", String.class));

        //step3
        String s = "{\"argIn1\":\"${var1}\",\"argIn2\":\"${var2}\"}";
        ValueExpression e = factory.createValueExpression(context, s, String.class);
        return String.valueOf(e.getValue(context));
    }

    public static boolean demo2() {
        ExpressionFactory factory = new ExpressionFactoryImpl();
        SimpleContext context = new SimpleContext();

        //step2
        context.setVariable("LastAction", factory.createValueExpression("@[FlowAction.StartEvent_N1.action_515976189]", String.class));
        context.setVariable("var2", factory.createValueExpression("World", String.class));

        //step3
        String s = "${LastAction==\"@[FlowAction.StartEvent_N1.action_515976189]\"}";
        ValueExpression e = factory.createValueExpression(context, s, boolean.class);
        return (Boolean)e.getValue(context);
    }
}
