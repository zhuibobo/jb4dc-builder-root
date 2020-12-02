const appClientUtility = require('./AppClientUtility.js');

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
}

function GetSession(){
    return Session;
}

module.exports = {
    BuildSession,
    GetSession
}

