/**
 * [AppListView description]
 * @param {[type]} node [description]
 * @param {Array}  apps [description]
 */
function AppListView(node, appVersions = []){
    this.node = node;
    this.appVersions = appVersions;
    this.ul = $(node).find('ul.pure-menu-list')[0];
}
AppListView.prototype.init = function(){}
AppListView.prototype.refreshView = function(){
    this.ul.innerHTML = this.appVersions.map(x=>{
        var v2Version = false;
        var version = x.versions.has(v2Version)?'v2':'v1';
        return '<li class="pure-menu-item"><a href="/pages/apps.html?appId='+x.app.id+'" class="pure-menu-link">'+x.app.name+'('+version+')</a></li>'
    }).join('\n');
}
function FileView(node, onNewUrl){
    this.node = node;
    this.input = node.querySelector('input');
    this.previewNode = $(node).find('.preview')[0];
    this.closeNode = $(node).find('.removeMe')[0];
    this.displayNode = $(node).find('p')[0];
    this.filename = '';
    this.data = '';
    this.file = '';
    this.iconUrl = '';
    this.uploadOngoing = Promise.resolve();
    this.onNewUri = onNewUrl||function(){};
}
FileView.prototype.init = function(){
    var self = this;
    this.input.addEventListener('change', function(){
        var reader = new FileReader();
        var file = self.input.files[0];
        self.file = file;
        reader.addEventListener('load', function(){
            self.previewNode.src = this.result;
            self.displayNode.classList.remove('hidden');
            self.data = this.result;
            self.filename = file.name;

            self.uploadOngoing = assetd.createAsset(self.file).then(function(asset){
                self.iconUrl = asset.url;
                self.onNewUri(self.iconUrl);
            })
        });

        reader.readAsDataURL(file);
    });

    this.closeNode.onclick = function(e){
        self.previewNode.src = '';
        self.iconUrl = '';
        self.onNewUri(iconUrl);
        if(!self.displayNode.classList.contains('hidden')){
            self.displayNode.classList.add('hidden')
        }
        e.preventDefault();
        return false;
    }
}

function CopiedCategsView(node){
    this.node = node;
    this.copiedCategs;
    this.categ = null;
    this.arr = [];
    this.ul = $(this.node).find('.pure-menu-list')[0];
}

CopiedCategsView.prototype.init = function(){
    var self = this;
    $(this.node).find('input').click(function(e){
        if(!self.categ){
            return;
        }
        synty.copyCateg(null, self.categ).then(function(res){
            self.categ.categIdToCateg[res.id] = new CategModel(res);
            self.categ.categIdToCateg[res.copiedFrom].copies.push(self.categ.categIdToCateg[res.id]);
            self.refreshView();
        })
        return false;
    })
}

CopiedCategsView.prototype.refreshView = function(){
    var self = this;
    if(!this.categ){return;}
    this.ul.innerHTML = self.categ.getCopies().map(x=>{
        return '<li class="pure-menu-item"><a class="pure-menu-link" href="/pages/categs/view.html?categId='+x.id+'">'+CategView.categIconHtml(x)+x.name+'</a></li>';
    }).join('\n');
}

function CategView(nodeOne){
    var self = this;
    this.hOne = nodeOne;
    this.categs = [];
    this.categ = null;
    this.copiedCategsView = new CopiedCategsView(this.hOne.querySelector('#copiedCategs'));

    this.c_linkedApps = this.hOne.querySelector('#linkedApps');
    this.c_id = this.hOne.querySelector('#c_id');
    this.c_name_en = this.hOne.querySelector('#c_name_en');
    this.c_name_fr = this.hOne.querySelector('#c_name_fr');
    this.c_name_de = this.hOne.querySelector('#c_name_de');
    this.c_color = this.hOne.querySelector('#c_color');
    this.c_children = this.hOne.querySelector('#children');
    this.c_iconUrl = this.hOne.querySelector('#c_iconUrl');
    this.c_placeHolder = this.hOne.querySelector('#c_placeHolder');
    this.iconUrlView = new FileView(this.c_iconUrl, (newUrl)=>{
        if(self.categ && self.categ._dirty){
            self.categ._dirty.iconUrl = newUrl;
        }
    })
    this.placeHolderView = new FileView(this.c_placeHolder, (newUrl)=>{
        if(self.categ && self.categ._dirty){
            self.categ._dirty.placeHolder = newUrl;
        }
    })
    this.appListView = new AppListView(this.c_linkedApps);
    this.saveNode = this.hOne.querySelector('#saveCateg')
}

CategView.categIconHtml = function(categ){
    return '<img height="30" width="30" style="background-color:#'+categ.color+';" src="'+categ.iconUrl+'">';
}
CategView.categPhHtml = function(categ){
    return '<img height="30" width="30" style="background-color:#'+categ.color+';" src="'+categ.placeHolder+'">';
}
CategView.prototype.setCateg = function(c){
    this.categ = c;
    this.copiedCategsView.categ = c;
}

CategView.prototype.init = function(){
    var self = this;
    $(this.c_children).find('.tools input[type=button]').on('click', function(e){
        var value = $(this).prev().val().trim();
        if(value.length != 24){
            alert('categ Id invalide:'+ value);
            return false;
        }
        var categ = self.categ.categIdToCateg[value];
        if(!categ){
            alert('categ n\'existe pas:'+ value);
            return false;
        }
        self.categ._dirty.children.unshift(categ);
        self.refreshView();
        return false;
    })

    $(this.c_children.querySelector('.pure-menu-list')).on('click', '.removeMe a', function(e){
        var categId = $(this).attr('data-cId');
        self.categ._dirty.children.some((x,i)=>{
            if(x.id == categId){
                self.categ._dirty.children.splice(i,1);
            }
        });
        self.refreshView();
        e.preventDefault();
        return false;
    })

    $.fn.colorPicker.defaults.colors = ['f94b58',
        'fec606',
        '47c9af',
        '2980b9',
        '71ba51',
        'c94769',
        'f6a4be',
        '9b4c05',
        '3bbcd8',
        '3da4ab',
        'ff7416',
        'c1c1c1'
    ]; //https://share-dev.citylity.com/synty/categColours/

    self.iconUrlView.init();
    self.placeHolderView.init();
    self.copiedCategsView.init();
    self.appListView.init();
    $(this.saveNode).on('click', function(){
        //needs a PATCH
        var delta = {};
        var patchNeeded = false; 
        ['iconUrl', 'placeHolder'].forEach(x=>{
            if(self.categ[x] != self.categ._dirty[x] && self.categ._dirty[x]){
                delta[x] = self.categ._dirty[x];
                patchNeeded = true;
            }
            return false;
        });

        ['name_en', 'name_fr', 'name_de'].forEach(x=>{

            self.categ._dirty[x] = self['c_'+x].value;
            if(self.categ._dirty[x] != self.categ[x]){
                delta[x] = self.categ._dirty[x];
                patchNeeded = true;
            }
        });

        self.categ._dirty.color = self.c_color.value.replace('#','');
        if(self.categ._dirty.color != self.categ.color){
            delta.color = self.categ._dirty.color;
            patchNeeded = true;
        }

        self.categ._dirty.children = [];
        $(self.c_children.querySelector('.pure-menu-list')).find('li').each(function(x){
            var id = $(this).find('[data-cId]').attr('data-cId');
            var categ = self.categ.categIdToCateg[id];
            self.categ._dirty.children.push(categ);
        })
        if(self.categ._dirty.children.map(x=>x.id).join('')!=self.categ.children.map(x=>x.id).join('')){
            delta.children = self.categ._dirty.children.map(x=>x.id);
            patchNeeded = true;
        }
        if(patchNeeded){
            return Promise.all([self.iconUrlView.uploadOngoing, self.placeHolderView.uploadOngoing]).then(function(){
                return synty.patchCateg(null, self.categ, delta).then(function(){
                    alert('save success');
                })
            }).catch(function(e){
                alert(JSON.stringify(e,null,1));
            })
        }
        return Promise.resolve();
    })
}

CategView.prototype.refreshView = function(){
    var self = this;
    this.copiedCategsView.refreshView();
    if(!this.categ){
        if(!this.hOne.classList.contains('hidden')){
            this.hOne.classList.add('hidden');
        }
        return;
    }
    this.appListView.appVersions = this.categ.getAppVersions();
    this.appListView.refreshView();
    this.c_id.innerHTML = this.categ.id;
    if(!this.colorPicker){
        this.c_color.value = this.categ.color;
        this.colorPicker = $(this.c_color).colorPicker();
    }
    this.c_name_en.value = this.categ._dirty.name_en;
    this.c_name_fr.value = this.categ._dirty.name_fr;
    this.c_name_de.value = this.categ._dirty.name_de;
    this.c_iconUrl.querySelector('.default').innerHTML = CategView.categIconHtml(self.categ);
    this.c_placeHolder.querySelector('.default').innerHTML = self.categ.placeHolder && CategView.categPhHtml(self.categ) || 'none';

    //childrenList
    str = this.categ._dirty.children.map(x=>{
        var rmStr = '<span class="removeMe">  <a data-cId="'+x.id+'" href="#"><i class="fa fa-remove"></i></a></span>';
        return '<li class="pure-menu-item">'+CategView.categIconHtml(x)+'<a href="/pages/categs/view.html?categId='+x.id+'">'+x.name+'</a>'+rmStr+'</li>';
    }).join('\n')
    var childrenList = this.c_children.querySelector('.pure-menu-list');
    childrenList.innerHTML = str;
    Sortable.create(childrenList);
}