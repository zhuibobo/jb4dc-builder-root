<template>
    <div class="flow-design-modeler-wraper">
        <spin size="large" fix v-if="isLoading"></spin>
        <div style="position: absolute;right: 10px;top: 6px;z-index: 100">
            <button-group size="small">
                <i-button icon="md-cloud-done" type="primary" @click="save()">保存</i-button>
                <i-button icon="md-cloud-done" type="primary">保存并部署</i-button>
                <i-button icon="md-checkmark" type="primary">校验窗体</i-button>
                <i-button icon="md-search" type="primary">历史版本</i-button>
                <i-button icon="md-search" type="primary" @click="consoleLogBpmnJsXml">console-log</i-button>
                <i-button icon="md-search" type="primary">关闭</i-button>
            </button-group>
        </div>
        <tabs name="flow-design-modeler-tabs"  @on-click="tabChange" v-model="selectedTabName">
            <tab-pane tab="flow-design-modeler-tabs" name="Bpmn" label="Bpmn">
                <flow-bpmnjs-container ref="flowBpmnjsContainer"></flow-bpmnjs-container>
            </tab-pane>
            <tab-pane tab="flow-design-modeler-tabs" name="XML" label="XML">
                <flow-xml-container ref="flowXmlContainer"></flow-xml-container>
            </tab-pane>
            <tab-pane tab="flow-design-modeler-tabs" name="Info" label="Document&Description">
                <flow-base-container ref="flowBaseContainer"></flow-base-container>
            </tab-pane>
        </tabs>

    </div>
</template>

<script>
    import flowBaseContainer from "./flow-base-container.vue";
    import flowBpmnjsContainer from "./flow-bpmnjs-container.vue";
    import jb4dcGeneralProperties from "./Properties/PropertiesComponent/jb4dc-general-properties.vue";
    import flowXmlContainer from "./flow-xml-container.vue";
    import {RemoteUtility} from '../Remote/RemoteUtility';
    import he from 'he';

    export default {
        name: 'flow-design-modeler',
        components: {
            flowBaseContainer,
            flowBpmnjsContainer,
            flowXmlContainer,
            jb4dcGeneralProperties
        },
        data:function () {
            return {
                isLoading:false,
                oldSelectedTabName:"",
                selectedTabName:"Bpmn"
            }
        },
        mounted:function(){
            this.initPageUI();

            /*function changeDum(name){
                if(name != ""){
                    name = name.replace(/[^\u0000-\u00FF]/g,function($0){return escape($0).replace(/(%u)(\w{4})/gi,"&#x$2;")});
                }
                return name;
            };*/
            function char_convert() {

                var chars = ["©","Û","®","ž","Ü","Ÿ","Ý","$","Þ","%","¡","ß","¢","à","£","á","À","¤","â","Á","¥","ã","Â","¦","ä","Ã","§","å","Ä","¨","æ","Å","©","ç","Æ","ª","è","Ç","«","é","È","¬","ê","É","­","ë","Ê","®","ì","Ë","¯","í","Ì","°","î","Í","±","ï","Î","²","ð","Ï","³","ñ","Ð","´","ò","Ñ","µ","ó","Õ","¶","ô","Ö","·","õ","Ø","¸","ö","Ù","¹","÷","Ú","º","ø","Û","»","ù","Ü","@","¼","ú","Ý","½","û","Þ","€","¾","ü","ß","¿","ý","à","‚","À","þ","á","ƒ","Á","ÿ","å","„","Â","æ","…","Ã","ç","†","Ä","è","‡","Å","é","ˆ","Æ","ê","‰","Ç","ë","Š","È","ì","‹","É","í","Œ","Ê","î","Ë","ï","Ž","Ì","ð","Í","ñ","Î","ò","‘","Ï","ó","’","Ð","ô","“","Ñ","õ","”","Ò","ö","•","Ó","ø","–","Ô","ù","—","Õ","ú","˜","Ö","û","™","×","ý","š","Ø","þ","›","Ù","ÿ","œ","Ú"];
                var codes = ["&copy;","&#219;","&reg;","&#158;","&#220;","&#159;","&#221;","&#36;","&#222;","&#37;","&#161;","&#223;","&#162;","&#224;","&#163;","&#225;","&Agrave;","&#164;","&#226;","&Aacute;","&#165;","&#227;","&Acirc;","&#166;","&#228;","&Atilde;","&#167;","&#229;","&Auml;","&#168;","&#230;","&Aring;","&#169;","&#231;","&AElig;","&#170;","&#232;","&Ccedil;","&#171;","&#233;","&Egrave;","&#172;","&#234;","&Eacute;","&#173;","&#235;","&Ecirc;","&#174;","&#236;","&Euml;","&#175;","&#237;","&Igrave;","&#176;","&#238;","&Iacute;","&#177;","&#239;","&Icirc;","&#178;","&#240;","&Iuml;","&#179;","&#241;","&ETH;","&#180;","&#242;","&Ntilde;","&#181;","&#243;","&Otilde;","&#182;","&#244;","&Ouml;","&#183;","&#245;","&Oslash;","&#184;","&#246;","&Ugrave;","&#185;","&#247;","&Uacute;","&#186;","&#248;","&Ucirc;","&#187;","&#249;","&Uuml;","&#64;","&#188;","&#250;","&Yacute;","&#189;","&#251;","&THORN;","&#128;","&#190;","&#252","&szlig;","&#191;","&#253;","&agrave;","&#130;","&#192;","&#254;","&aacute;","&#131;","&#193;","&#255;","&aring;","&#132;","&#194;","&aelig;","&#133;","&#195;","&ccedil;","&#134;","&#196;","&egrave;","&#135;","&#197;","&eacute;","&#136;","&#198;","&ecirc;","&#137;","&#199;","&euml;","&#138;","&#200;","&igrave;","&#139;","&#201;","&iacute;","&#140;","&#202;","&icirc;","&#203;","&iuml;","&#142;","&#204;","&eth;","&#205;","&ntilde;","&#206;","&ograve;","&#145;","&#207;","&oacute;","&#146;","&#208;","&ocirc;","&#147;","&#209;","&otilde;","&#148;","&#210;","&ouml;","&#149;","&#211;","&oslash;","&#150;","&#212;","&ugrave;","&#151;","&#213;","&uacute;","&#152;","&#214;","&ucirc;","&#153;","&#215;","&yacute;","&#154;","&#216;","&thorn;","&#155;","&#217;","&yuml;","&#156;","&#218;"];

                for(x=0; x<chars.length; x++){
                    for (i=0; i<arguments.length; i++){
                        arguments[i].value = arguments[i].value.replace(chars[x], codes[x]);
                    }
                }
            }
            //var parser = new htmlparser2.Parser();
            var s1 = "你还&#62;10";
            console.log(he.decode(s1));
            console.log(he.encode(he.decode(s1)));
        },
        methods:{
            consoleLogBpmnJsXml:function () {
                this.$refs["flowBpmnjsContainer"].logXML();
            },
            tabChange:function () {

            },
            initPageUI:function(){
                this.isLoading=true;
                this.oldSelectedTabName=this.selectedTabName;
                RemoteUtility.TryLoadModuleContext("");
                window.setTimeout(() => {
                    this.isLoading=false;
                },200);

            },
            isXMLToOther:function(name){
                if(this.oldSelectedTabName=="XML"){
                    //if(name=="Design"){
                    return true;
                    //}
                }
                return false;
            },
            isBpmnDesignToOther:function(name){
                if(this.oldSelectedTabName=="Bpmn"){
                    //if(name=="HTML"){
                    return true;
                    //}
                }
                return false;
            },
            tabChange:function (name) {
                if(this.isBpmnDesignToOther(name)){
                    var xml=this.$refs["flowBpmnjsContainer"].getXML();
                    //console.log(xml);
                    var selectedElem=this.$refs["flowBpmnjsContainer"].getSelectedElement();
                    this.$refs["flowXmlContainer"].setXML(xml,selectedElem);
                    //var html=CKEditorUtility.GetCKEditorHTML();
                    //JBuild4DC.FormDesign.SetHTMLEditorHTML("<div id='aaa'><div><div><div>ssssssssss</div></div></div></div>");
                    //HTMLEditorUtility.SetHTMLEditorHTML(html);
                }
                else if(this.isXMLToOther(name)){
                    var xml=this.$refs["flowXmlContainer"].getXML();
                    this.$refs["flowBpmnjsContainer"].setXML(xml);
                    //alert(html);
                    //CKEditorUtility.SetCKEditorHTML(html);
                }
                this.oldSelectedTabName=name;
            }
        }
    }
</script>
