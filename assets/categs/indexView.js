function CategModel(x, appIdToApp = {}){
    this.categIdToCateg = {};
    this.appIdToApp = appIdToApp;
    this.parents = [];
    this.children = [];
    this.copies = [];
    this._dirty = {};
    for(var i in x){
        this[i] = x[i];//only works for primitive types
        this._dirty[i] = x[i];
    }
}
CategModel.prototype.updfs = function(explored = new Set){
    explored.add(this);
    this.parents.forEach(x=>{
        if(explored.has(x)){
            return;
        }
        x.updfs(explored);
    });
    return explored;
}
CategModel.prototype.getAppVersions = function(){
    var self = this;
    var categs = [...this.updfs()];
    var appIdToAV = {};
    var s = categs.reduce(function(acc,x){
        if(x.appId && x.appId.length){
            if(self.appIdToApp[x.appId]){
                var app = self.appIdToApp[x.appId];
                acc[x.appId] = acc[x.appId] || { app: app, versions:new Set};
                acc[x.appId].versions.add(x.v1Version);
            }
        }
        return acc;
    },{});
    return Object.keys(s).map(key=>s[key]);
}
CategModel.prototype.getCopies = function(){
    return this.copies;
}
function main(){
    synty.conf('base',CONSTANTS.syntyUrl);
    userd.conf('base',CONSTANTS.userdUrl);
    assetd.conf('base',CONSTANTS.assetdUrl);
    var loginView = new LoginView(document.getElementById('login'), userd);
    var categView = new CategView(document.getElementById('categ'));
    (new MenuView(document.getElementById('menu'))).init();
    categView.init();
    
    loginView.on('logged', function(cred){
        synty.cred = cred;
        userd.cred = cred;
        assetd.cred = cred;
        return Promise.all([
            synty.getApps(),
            synty.getRawCategories()
        ]).then(function(res){
            var apps = res.shift().items;
            var categs = res.shift().items.map(x=>new CategModel(x));
            //bind apps to categ
            var appIdToApp = apps.reduce((acc,x)=>{
                acc[x.id] = x;
                return acc;
            },{});
            var categIdToCateg = categs.reduce((acc,x)=>{
                acc[x.id] = x;
                return acc;
            },{})
            categs.forEach(function associateTreeToApp(x){
                x.categIdToCateg = categIdToCateg;
                x.appIdToApp = appIdToApp;
                var arr = [];
                x.children.forEach((y,i)=>{
                    var child = categIdToCateg[y];
                    if(child){
                        child.parents = child.parents || [];
                        child.parents.push(x);
                        arr.push(child);
                    }
                });
                x.children = arr;
                x._dirty.children = x.children.slice(0);
                if(x.copiedFrom){
                    if(categIdToCateg[x.copiedFrom]){
                        categIdToCateg[x.copiedFrom].copies.push(x);
                    }
                }
            });
            categView.categs = categs;

            var params = UTILS.getParams(window.location.search);
            var categ;
            if(params.categId){
                categ = categIdToCateg[params.categId];
            }else{
                categ = categs[0];
            }
            document.getElementsByTagName('title')[0].innerHTML = 'categ-'+categ.name;
            categView.setCateg(categ);
            categView.refreshView();
            
        })
    })
    loginView.init();
}

$(document).ready(main);