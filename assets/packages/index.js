function main(){
    synty.conf('base',CONSTANTS.syntyUrl);
    userd.conf('base',CONSTANTS.userdUrl);
            
    var loginView = new LoginView(document.getElementById('login'), userd);
    var packageView = new PackageView(document.getElementById('package'));
    (new MenuView(document.getElementById('menu'))).init();
    loginView.on('logged', function(cred){
        packageView.cred = cred;
        packageView.init();
        synty.cred = cred;
        userd.cred = cred;
    })
    loginView.init();
}

$(document).ready(main);