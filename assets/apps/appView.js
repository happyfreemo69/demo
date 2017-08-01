function AppView(nodeList, nodeOne){
    this.hList = nodeList;
    this.hOne = nodeOne;
    this.apps = [];
    this.c_createApp = $('#createApp')[0];
    this.c_linkTree = $('#linkTree')[0];
    this.c_copyApp = $('#copyApp')[0];
}
AppView.prototype.refreshList = function(){
    var self = this;
    //this is not perf efficient but removes a dependency :)
    this.hList.querySelector('table').innerHTML = this.apps.map(x=>{
        var strHasApp = x.tree?'hasTree':'';
        return '<tr><td id="app_'+x.id+'" class="'+strHasApp+'"><a href="#" class="as-pure-link">'+x.name+'</a></td><td>'+x.type+'</td></tr>';
    }).join('\n');

    $(this.hList).on('click', 'a', function(e){
        var appId = $(this).parent().attr('id');
        if(appId){
            appId = appId.replace(/app_/,'');
        }
        self.app = self.apps.find(x=>x.id==appId);
        if(!self.app){
            console.log('FAILED ', appId)
        }
        document.getElementsByTagName('title')[0].innerHTML = 'app-'+self.app.name;
        var str = window.location.toString().replace(/\?.*/,'')+'?appId='+self.app.id;
        window.history.pushState({}, self.app.name, str);
        self.refreshView();
        return false;
    })
}

function categToHtml(categ){
    return '<div><img height="30" width="30" style="background-color:#'+categ.color+';" src="'+categ.iconUrl+'">  <a class="as-pure-link" href="/pages/categs/view.html?categId='+categ.id+'">'+categ.name+'</a></div>';
}
function treeToHtml(tree, first=true){
    if(tree.children && tree.children.length){
        var str = '';
        if(first){
            str += '<div><a class="as-pure-link" href="/pages/categs/view.html?categId='+tree.id+'">'+tree.name+'</a></div>';
        }else{
            str += categToHtml(tree);
        }
        str += '<ul'+(first?' class="tree"':'')+'>';
        str += tree.children.map(x=>{
            return '<li>'+treeToHtml(x, false)+'</li>';
        }).join('\n')
        str += '</ul>';
        return str;
    }
    return categToHtml(tree);
}
AppView.prototype.refreshView = function(){
    var self = this;
    //this is not perf efficient but removes a dependency :)
    if(!this.app){
        this.hOne.innerHtml = 'Select an app';
        return;
    }
    var str = 'name: '+this.app.name;
    str += '<p>Arbre:</p>';
    this.app.fetchTree().then(tree=>{
        str += '<div id="tree">'+(this.app.tree && treeToHtml(this.app.tree) || 'no tree')+'</div>';
        this.hOne.innerHTML = str;
    })
}

AppView.prototype.init = function(){
    var self = this;

    $(this.c_linkTree).on('submit', function(e){
        if(!self.app){return false;}
        var id = this.treeId.value;
        if(id.length!=24){
            alert('expects a categId (24 caracteres)');
            return false;
        }
        var p = Promise.resolve();
        p = p.then(function(){
            return self.app.fetchTree().then(function(tree){
                if(!tree){
                    return;
                }
                //unset the tree
                var oldCategId = tree.id;
                return synty.patchCateg(null, {id: oldCategId}, {unset_appId: true});
            })
        })
        p.then(function(){
            return synty.patchCateg(null, {id: id}, {appId: self.app.id}).then(function(res){
                window.location = '/pages/apps.html?appId='+self.app.id;
            })
        }).catch(function(e){
            alert(JSON.stringify(e,null,1))
        });
        e.preventDefault();
        return false;
    })

    $(this.c_copyApp).on('submit', function(e){
        if(!self.app){return false;}
        var name = this.name.value;
        if(name.length<1){
            alert('expects a name');
            return false;
        }
        synty.copyApp(null, {id:self.app.id},{name: name}).then(function(res){
            window.location = '/pages/apps.html?appId='+res.id;
        }).catch(function(e){
            alert(JSON.stringify(e,null,1))
        });
        e.preventDefault();
        return false;
    })
}