import appClientUtility from './AppClientUtility.js';
import axios from 'axios';

const Session = {
    UserId: "",
    UserName: "",
    OrganName: "",
    OrganId: "",
    AppClientToken:""
}

function BuildSession() {
    Session.UserId = appClientUtility.GetUrlParaValue("UserId");
    Session.UserName = appClientUtility.GetUrlParaValue("UserName");
    Session.OrganName = appClientUtility.GetUrlParaValue("OrganName");
    Session.OrganId = appClientUtility.GetUrlParaValue("OrganId");
    Session.AppClientToken=appClientUtility.GetUrlParaValue("AppClientToken");
    console.log("从url中构建Session");
}

function GetSession(){
    if(appClientUtility.StringUtility.IsNullOrEmpty(Session.UserId)){
        BuildSession();
    }
    return Session;
}

function GetSessionFromServerByTokenId(tokenId,func){
    axios.get("/GridSystem/Rest/Grid/User/UserInfo/GetSessionInfoByTokenId", {
        params: {
            tokenId: tokenId,
            AppClientToken: tokenId,
            ts:Date.now()
        }
    }).then((response) => {
        func(response);
    });
}

export default {
    BuildSession,
    GetSession,
    GetSessionFromServerByTokenId
}

