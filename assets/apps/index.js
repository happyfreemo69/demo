function AppModel(json){
    for(var i in json){
        this[i] = json[i];
    }
    this.tree;
}

AppModel.prototype.fetchTree = function(){
    if(typeof(this.tree)!='undefined'){
        return Promise.resolve(this.tree);
    }
    return synty.getTree(null, {appId: this.id}).then(res=>{
        this.tree = this.buildTree(res.items);
        return this.tree;
    }).catch(e=>{
        console.log('no valid tree linked to this app. Letting it undefined on purpose');
    })
}

AppModel.prototype.buildTree = function(categs){
    var categIdToCateg = categs.reduce((acc,x)=>{
        acc[x.id] = x;
        return acc;
    },{})
    var root = null;
    categs.forEach(x=>{
        if(x.appId == this.id){
            root = x;
        }
        x.children = x.children.map(id=>categIdToCateg[id])
    });

    console.log('got ', categs, root)
    return root;
}

function main(){
    synty.conf('base',CONSTANTS.syntyUrl);
    userd.conf('base',CONSTANTS.userdUrl);
            
    var loginView = new LoginView(document.getElementById('login'), userd);
    var appView = new AppView(document.getElementById('appList'), document.getElementById('app'));
    (new MenuView(document.getElementById('menu'))).init();
    loginView.on('logged', function(cred){
        appView.init();
        synty.cred = cred;
        userd.cred = cred;
        return synty.getApps().then(function(res){
            var apps = res.items.map(x=>new AppModel(x));
            var appIdToApp = apps.reduce((acc,x)=>{
                acc[x.id] = x;
                return acc;
            },{});

            appView.apps = Object.keys(appIdToApp).map(id=>appIdToApp[id]).sort((a,b)=>a.name.localeCompare(b.name));
            appView.refreshList();
            var params = UTILS.getParams(window.location.search);
            if(params.appId){
                appView.app = appIdToApp[params.appId];
            }else{
                appView.app = apps[0];
            }
            document.getElementsByTagName('title')[0].innerHTML = 'app-'+app.name;
            appView.refreshView();
        }).catch(e=>{
            console.log('failed. Most probably the user does not have the proper group', e);
        })
    })
    loginView.init();
}

$(document).ready(main);