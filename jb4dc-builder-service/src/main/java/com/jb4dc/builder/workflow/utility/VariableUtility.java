package com.jb4dc.builder.workflow.utility;

public class VariableUtility {
    public static String getSingleVariableName(String expression){
        String variableName=expression.replace("#{","").replace("${","").replace("}","");
        return variableName;
    }
}
