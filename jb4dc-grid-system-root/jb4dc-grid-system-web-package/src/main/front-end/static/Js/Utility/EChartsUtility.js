var EChartsUtility={
    AutoSetStatus:function (vueObject){
        if(BaseUtility.GetUrlParaValue("streetValue")){
            $("#sel_3l_street").attr("control_value",BaseUtility.GetUrlParaValue("streetValue"));
            vueObject.showStreetNormalBuildStatistics=false;
        }
        if(BaseUtility.GetUrlParaValue("communityValue")){
            $("#sel_3l_community").attr("control_value",BaseUtility.GetUrlParaValue("communityValue"));
            vueObject.showStreetNormalBuildStatistics=false;
        }
        if(BaseUtility.GetUrlParaValue("gridValue")){
            $("#sel_3l_grid").attr("control_value",BaseUtility.GetUrlParaValue("gridValue"));
            vueObject.showStreetNormalBuildStatistics=false;
        }
    },
    FetchDataOrganFilter:function (url,streetValue,communityValue,gridValue,func,caller){
        AjaxUtility.Get(url,{
            streetValue:streetValue,
            communityValue:communityValue,
            gridValue:gridValue
        },function (result){
            if(result.success) {
                func(result);
            }
        },caller);
    },
    BuildNormalPieOption:function (dataList,seriesName,title,radius){
        var legendConfig = {
            orient: 'vertical',
            left: 'left',
            data: []
        };
        var seriesDataConfig=[];
        var subTitle="";

        var valueCount=0;
        for (var i = 0; i < dataList.length; i++) {
            legendConfig.data.push(dataList[i].NAME);
            seriesDataConfig.push({value: dataList[i].VALUE, name: dataList[i].NAME})
            valueCount += parseFloat(dataList[i].VALUE);
        }
        subTitle="总数:"+valueCount;

        if(!radius){
            radius='60%';
        }

        var seriesConfig = [{
            name: seriesName,
            type: 'pie',
            radius: radius,
            center: ['50%', '60%'],
            data: seriesDataConfig,
            label:{
                show:true,
                formatter: '{b}: {c}',
                alignTo: 'labelLine'
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }];


        var option = {
            title: {
                text: title,
                subtext: subTitle,
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: legendConfig,
            series: seriesConfig
        };

        return option;
    },
    BuildNormalBarOption:function (dataList,seriesName,title){
        var xAxisConfig = {
            type: 'category',
            data: [],
            axisTick: {
                alignWithLabel: true,
                interval:0
            },
            axisLabel:{
                interval:0
            }
        };
        var seriesDataConfig=[];
        var subTitle="";

        var valueCount=0;
        for (var i = 0; i < dataList.length; i++) {
            xAxisConfig.data.push(dataList[i].NAME);
            seriesDataConfig.push({value: dataList[i].VALUE, name: dataList[i].NAME})
            valueCount += parseFloat(dataList[i].VALUE);
        }
        subTitle="总数:"+valueCount;

        var seriesConfig = [{
            name: seriesName,
            type: 'bar',
            data: seriesDataConfig,
            label:{
                show:true,
                formatter: '{c}',
                alignTo: 'labelLine'
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }];


        var option = {
            title: {
                text: title,
                subtext: subTitle,
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c}'
            },
            grid: {
                left:"6%",
                right:"6%",
                bottom: 20,
            },
            xAxis: [xAxisConfig],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: seriesConfig
        };

        return option;
    }
}