var EChartsUtility={
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
    BuildNormalPieOption:function (dataList,seriesName,title){
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

        var seriesConfig = [{
            name: seriesName,
            type: 'pie',
            radius: '55%',
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
    }
}