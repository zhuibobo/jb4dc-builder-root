<template>
    <div>
        <table class="properties-dialog-table-wraper" cellpadding="0" cellspacing="0" border="0">
            <colgroup>
                <col style="width: 14%" />
                <col style="width: 86%" />
            </colgroup>
            <tbody>
            <tr>
                <td>边界事件类型：</td>
                <td colspan="3">
                    <Tag type="dot" color="success">{{innerEventTypeName}}</Tag>
                    <radio-group style="margin: auto" v-model="innerEventType" @on-change="changeInnerEventType" v-if="false">
                        <radio disabled label="boundary-event-message">消息事件(中断)</radio>
                        <radio disabled label="boundary-event-time">定时事件(中断)</radio>
                        <radio disabled label="boundary-event-signal">信号事件(中断)</radio>
                        <radio disabled label="boundary-event-message-non-interrupting">消息事件(非中断)</radio>
                        <radio disabled label="boundary-event-time-non-interrupting">定时事件(非中断)</radio>
                        <radio disabled label="boundary-event-signal-non-interrupting">信号事件(非中断)</radio>
                    </radio-group>
                </td>
            </tr>
            <tr v-if="innerEventType=='boundary-event-message'||innerEventType=='boundary-event-message-non-interrupting'">
                <td>消息：</td>
                <td>
                    <Select style="width:400px" v-model="bpmn.messageEventDefinition.messageRef">
                        <Option v-for="item in bpmn.messages" :value="item.id" :key="item.id">[{{item.id}}]{{item.name}}</Option>
                    </Select>
                </td>
            </tr>
            <tr v-if="innerEventType=='boundary-event-signal'||innerEventType=='boundary-event-signal-non-interrupting'">
                <td>信号：</td>
                <td>
                    <Select style="width:400px" v-model="bpmn.signalEventDefinition.signalRef">
                        <Option v-for="item in bpmn.signals" :value="item.id" :key="item.id">[{{item.id}}]{{item.name}}</Option>
                    </Select>
                </td>
            </tr>
            <tr v-if="innerEventType=='boundary-event-time'||innerEventType=='boundary-event-time-non-interrupting'">
                <td>定时类型：</td>
                <td>
                    <radio-group type="button" style="margin: auto" v-model="innerTimeType" @on-change="changeInnerTimeType">
                        <radio label="timeDate">指定时间</radio>
                        <radio label="timeDuration">延期时间</radio>
                        <radio label="timeCycle">周期时间</radio>
                    </radio-group>
                </td>
            </tr>
            <tr v-if="innerEventType=='boundary-event-time'||innerEventType=='boundary-event-time-non-interrupting'">
                <td>定时表达式：</td>
                <td>
                    <input type="text" v-model="bpmn.timerEventDefinition.value" />
                    <div>
                        <div>指定时间</div>
                        <div>
                            <pre>2021-03-11T12:13:14Z</pre>
                        </div>
                        <div>延期时间</div>
                        <div>
                            <pre>PT1.5S = 1.5 Seconds;PT60S = 60 Seconds;PT3M = 3 Minutes;PT2H = 2 Hours;P3DT5H40M30S = 3Days, 5Hours, 40 Minutes and 30 Seconds</pre>
                        </div>
                        <div>周期时间</div>
                        <div>
                            <pre>R4/2021-03-11T12:13/PT5M = 重复4次, 每次间隔5分钟, 从2021年3月11日 12:13开始计时</pre>
                            <pre>R3/PT10H = 重复3次，每次间隔10小时</pre>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>说明：</td>
                <td colspan="3">
                    <textarea placeholder="bpmn.documentation" rows="6" v-model="bpmn.documentation"></textarea>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import {PODefinition} from "../../BpmnJsExtend/PODefinition";

export default {
    name: "general-event-properties",
    props:["propBpmnGeneralData"],
    data:function () {
        return {
            bpmn: {},
            innerEventType:"",
            innerEventTypeName:"",
            innerTimeType:"timeDuration"
        }
    },
    mounted() {
        this.bpmn = this.propBpmnGeneralData;
        //console.log(this.jb4dc.jb4dcActions);
        if (this.bpmn.messageEventDefinition && this.bpmn.messageEventDefinition.id && this.bpmn.cancelActivity == "true") {
            this.innerEventType = "boundary-event-message";
            this.innerEventTypeName = "消息边界事件(中断)";
        } else if (this.bpmn.messageEventDefinition && this.bpmn.messageEventDefinition.id && this.bpmn.cancelActivity == "false") {
            this.innerEventType = "boundary-event-message-non-interrupting";
            this.innerEventTypeName = "消息边界事件(非中断)";
        } else if (this.bpmn.timerEventDefinition && this.bpmn.timerEventDefinition.id && this.bpmn.cancelActivity == "true") {
            this.innerEventType = "boundary-event-time";
            this.innerEventTypeName = "时间边界事件(中断)";
        } else if (this.bpmn.timerEventDefinition && this.bpmn.timerEventDefinition.id && this.bpmn.cancelActivity == "false") {
            this.innerEventType = "boundary-event-time-non-interrupting";
            this.innerEventTypeName = "时间边界事件(非中断)";
        } else if (this.bpmn.signalEventDefinition && this.bpmn.signalEventDefinition.id && this.bpmn.cancelActivity == "true") {
            this.innerEventType = "boundary-event-signal";
            this.innerEventTypeName = "信号边界事件(中断)";
        } else if (this.bpmn.signalEventDefinition && this.bpmn.signalEventDefinition.id && this.bpmn.cancelActivity == "false") {
            this.innerEventType = "boundary-event-signal-non-interrupting";
            this.innerEventTypeName = "信号边界事件(非中断)";
        }
    },
    methods:{
        changeInnerTimeType(){
        },
        changeInnerEventType(){
        },
        handleEventDefinition(bpmnData){
            bpmnData.messageEventDefinition.id = "";
            bpmnData.timerEventDefinition.id = "";
            bpmnData.signalEventDefinition.id = "";
            if (this.innerEventType.indexOf("non-interrupting") > 0) {
                bpmnData.cancelActivity = "false";
            } else {
                bpmnData.cancelActivity = "true";
            }
            if (this.innerEventType == "boundary-event-message" || this.innerEventType == "boundary-event-message-non-interrupting") {
                bpmnData.messageEventDefinition.id = "MessageEventDefinition_" + StringUtility.Timestamp();
            } else if (this.innerEventType == "boundary-event-time" || this.innerEventType == "boundary-event-time-non-interrupting") {
                bpmnData.timerEventDefinition.id = "TimerEventDefinition_" + StringUtility.Timestamp();
                bpmnData.timerEventDefinition.type = this.innerTimeType;
            } else if (this.innerEventType == "boundary-event-signal" || this.innerEventType == "boundary-event-signal-non-interrupting") {
                bpmnData.signalEventDefinition.id = "SignalEventDefinition_" + StringUtility.Timestamp();
            }
        }
    }
}
</script>

<style scoped>

</style>