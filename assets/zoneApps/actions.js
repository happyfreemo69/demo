$(document).ready(function(){
    synty.conf('base',CONSTANTS.syntyUrl);
    userd.conf('base',CONSTANTS.userdUrl);
            
    var loginView = new LoginView(document.getElementById('login'), userd);
    loginView.on('logged', function(cred){
        synty.cred = cred;
        userd.cred = cred;
        //if has a custom zoneApp, link to bo
        //else propose creation
        return synty.getMe().then(me=>{
            return synty.getUrl({}, me.links.moderatedCampuses);
        }).then(campuses=>{
            if(campuses.length){
                var boView = new BoView($('#manageView')[0], packages[0]);
                return boView.show();
            }
            var createView = new CreateView($('#createView')[0]);
            return createView.show();
        }).catch(e=>alert(JSON.stringify(e)));
    })
    loginView.init();
})