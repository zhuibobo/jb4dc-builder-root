package com.jb4dc.gridsystem.service.statistics.impl;

import com.jb4dc.base.service.ISQLBuilderService;
import com.jb4dc.core.base.tools.StringUtility;
import org.springframework.beans.factory.annotation.Autowired;

public class BaseStatistics {

    @Autowired
    public ISQLBuilderService sqlBuilderService;

    public String calculateUseOrganId(String streetValue, String communityValue, String gridValue){
        if(StringUtility.isNotEmpty(gridValue)){
            return gridValue;
        }
        if(StringUtility.isNotEmpty(communityValue)){
            return communityValue;
        }
        if(StringUtility.isNotEmpty(streetValue)){
            return streetValue;
        }
        return "0";
    }
}
