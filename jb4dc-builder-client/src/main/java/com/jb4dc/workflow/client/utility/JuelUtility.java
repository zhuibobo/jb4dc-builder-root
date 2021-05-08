package com.jb4dc.workflow.client.utility;

import com.jb4dc.core.base.session.JB4DCSession;
import com.jb4dc.workflow.po.JuelRunResultPO;
import de.odysseus.el.ExpressionFactoryImpl;
import de.odysseus.el.util.SimpleContext;

import javax.el.ExpressionFactory;
import javax.el.ValueExpression;
import java.util.Map;

public class JuelUtility {

    public static JuelRunResultPO buildStringExpression(JB4DCSession jb4DCSession, String expression, Map<String,Object> vars) {
        try {
            ExpressionFactory factory = new ExpressionFactoryImpl();
            SimpleContext context = new SimpleContext();

            for (Map.Entry<String, Object> stringObjectEntry : vars.entrySet()) {
                context.setVariable(stringObjectEntry.getKey(), factory.createValueExpression(stringObjectEntry.getValue().toString(), String.class));
            }

            ValueExpression e = factory.createValueExpression(context, expression, String.class);
            String result=String.valueOf(e.getValue(context));
            return new JuelRunResultPO(true,"",result,false);
        }
        catch (Exception ex){
            return new JuelRunResultPO(false,ex.getMessage(),"",false);
        }
    }

    public static JuelRunResultPO buildBoolExpression(JB4DCSession jb4DCSession, String expression, Map<String,Object> vars) {
        try {
            ExpressionFactory factory = new ExpressionFactoryImpl();
            SimpleContext context = new SimpleContext();

            for (Map.Entry<String, Object> stringObjectEntry : vars.entrySet()) {
                context.setVariable(stringObjectEntry.getKey(), factory.createValueExpression(stringObjectEntry.getValue().toString(), String.class));
            }

            ValueExpression e = factory.createValueExpression(context, expression, boolean.class);
            boolean result = (Boolean) e.getValue(context);
            return new JuelRunResultPO(true, "", "", result);
        } catch (Exception ex) {
            return new JuelRunResultPO(false, ex.getMessage(), "", false);
        }
    }

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
