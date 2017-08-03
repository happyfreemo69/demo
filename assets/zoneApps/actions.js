$(document).ready(function(){
    synty.conf('base',CONSTANTS.syntyUrl);
    userd.conf('base',CONSTANTS.userdUrl);
    var loginView = new LoginView(document.getElementById('login'), userd);
    (new MenuView(document.getElementById('menu'), loginView)).init();

    var createView = new CreateView($('#createView')[0], synty);
    console.log('GOOOO2');
    createView.init();
    loginView.on('logged', function(cred){
        synty.cred = cred;
        userd.cred = cred;
        //if has a custom zoneApp, link to bo
        //else propose creation
        return synty.getMe().then(me=>{
            createView.me = me;
            return synty.get({}, me.links.moderatedCampuses).catch(e=>{
                console.log('got error ', e, e.toString(), e.responseText)
                throw e;
            })
        }).then(campuses=>{
            if(campuses.count > 0){
                console.log('rending ', campuses.count)
                var boView = new BoView($('#boView')[0], campuses[0]);
                return boView.render().show();
            }
            synty.getDemoApps({},{demo:true}).then(apps=>{
                createView.apps = apps.items;
                createView.render();
            }).catch(e=>alert(JSON.stringify(e)));
            console.log('rending ')
            
            createView.render();
            createView.show();
            createView.initMap();//only after show
            return;
        }).catch(e=>alert(JSON.stringify(e)));
    })
    loginView.init();
})