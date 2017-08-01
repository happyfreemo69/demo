function PackageModel(json){
    this._dirty = {};
    for(var i in json){
        this._dirty[i] = json[i];
        this[i] = json[i];
    }
}
function SyndicView(node, package){
    this.node = node;
    this.package = package;
    this.h_title = $(node).find('.title')[0];
    this.h_input = $(node).find('.inputs')[0];
    this.method = synty.patchSyndic.bind(synty);
}

SyndicView.prototype.refresh = function(){
    var s = this.package;
    var fields = [];
    var mapping = {
        syndic:[
            {id:'primaryAppId', label:'building', appId:s._dirty.primaryAppId},
        ],
        bailleur:[
            {id:'primaryAppId', label:'building', appId:s._dirty.primaryAppId},
            {id:'secondaryAppId', label:'flat', appId:s._dirty.secondaryAppId},
        ],
        flatMgr:[
            {id:'primaryAppId', label:'flat', appId:s._dirty.primaryAppId},
        ]
    }
    this.h_title.classList.remove('hidden');
    this.h_title.innerHTML = 'Edition de '+s.name+' ('+s.entityType+')';
    var inputs = mapping[s.entityType].map(x=>{
        return `
            <div class="field">
              <label for="${x.id}">appId ${x.label} (<a href="/pages/apps.html?appId=${x.appId}">détail</a>): </label>
              <input id="${x.id}" value="${x.appId}" />
            </div>
        `
    }).join('\n');
    this.h_input.innerHTML = inputs;
    this.h_input.innerHTML+='<input id="saveCateg" type="button" class="pure-button" value="sauvegarder"/>';
}
function ZoneView(node, package){
    this.node = node;
    this.package = package;
    this.h_title = $(node).find('.title')[0];
    this.h_input = $(node).find('.inputs')[0];
    if(package._type=='city'){
        this.method = synty.patchCity.bind(synty);
    }else{
        this.method = synty.patchCampus.bind(synty);
    }
}
ZoneView.prototype.refresh = function(){
    var s = this.package;
    this.h_title.classList.remove('hidden');
    this.h_title.innerHTML = 'Edition de '+s.name+' ('+s._type+')';
    var inputs = `
        <div class="field">
          <label for="appId">appId (<a href="/pages/apps.html?appId=${s._dirty.appId}">détail</a>): </label>
          <input id="appId" value="${s._dirty.appId}" />
        </div>
    `
    this.h_input.innerHTML = inputs;
    this.h_input.innerHTML+='<input id="saveCateg" type="button" class="pure-button" value="sauvegarder"/>';
}
function SelectedView(node){
    this.node = node;
    this.package = null;
    this.viewers = {};
}
SelectedView.prototype.init = function(){
    $(this.node).on('click', '#saveCateg', (e)=>{
        if(this.package==null){return};
        var s = this.package;
        var viewer = this.getViewerFromPackage(this.package);
        var fields = ['appId', 'primaryAppId', 'secondaryAppId']
        var setters = fields.reduce((acc,x)=>{
            $(this.node).find('#'+x).each(function(){
                s._dirty[x] = $(this).val();
                if(s._dirty[x]!=s[x]){
                    acc[x] = s._dirty[x];
                }
            })
            return acc;
        },{});
        if(Object.keys(setters).length==0){
            alert('nothing has changed');
            return false;
        }
        return viewer.method(null, {id:s.id}, setters).then(function(){
            alert('save success');
        }).catch(e=>{
            alert('FAILED '+JSON.stringify(e));
        })
    })
}
SelectedView.prototype.getViewerFromPackage = function(package){
    if(this.viewers[package._type]){
        this.viewers[package._type].package = package;
        return this.viewers[package._type];
    }
    var x;
    if(package._type == 'syndic'){
        x = new SyndicView(this.node, package);
    }else{
        x = new ZoneView(this.node, package);
    }
    this.viewers[package._type] = x;
    return x;
}
SelectedView.prototype.setPackage = function(package){
    this.package = package;
}
SelectedView.prototype.refresh = function(){
    if(this.package == null){
        this.node.innerHTML = 'nothing to be seen';
    }
    var viewer = this.getViewerFromPackage(this.package);
    viewer.refresh();
}


function PackageView(node){
    this.node = node;
    this.hSelect = $(node).find('#select')[0];
    this.selectedView = new SelectedView($(node).find('#view')[0]);
    this.packages = {};
}
PackageView.prototype.urlFromType = function(type){
    var mapping = {
        city: 'cities',
        syndic:'syndics',
        campus:'campuses'
    }
    var apiType = mapping[type];
    return CONSTANTS.syntyUrl+'/v1/admin/'+apiType;
}
PackageView.prototype.init = function(){
    var self = this;
    this.type = $(this.hSelect).find('.packageTypes')[0].value;
    this.url = this.urlFromType($(this.hSelect).find('.packageTypes')[0].value);
    $(this.hSelect).find('.packageTypes').on('change', function(){
        self.type = this.value;
        self.url = self.urlFromType(this.value);
    });
    self.selectedView.init();
    var ajaxOptions = {
        url: ()=>self.url,
        dataType: 'json',
        delay: 250,
        headers:{
            Authorization: 'bearer '+self.cred.access_token
        },
        data: function (params) {
            params.type = self.type;
            params.limit = 10;
            return {
                query: params.term, // search term
                page: params.page,
                limit: params.limit
            };
        },
        processResults: function (data, params) {
            // parse the results into the format expected by Select2
            // since we are using custom formatting functions we do not need to
            // alter the remote JSON data, except to indicate that infinite
            // scrolling can be used
            params.page = params.page || 1;
            var items = data.items.reduce((acc,x)=>{
                if(x.id.length!=24){return acc;}
                x.text = x.name;
                x._type = params.type;
                var package = new PackageModel(x);
                self.packages[x.id] = package;
                //select2compliance
                acc.push(x);
                return acc;
            },[]);
            return {
                results: items,
                pagination: {
                    more: params.page*params.limit < data.count
                }
            };
        },
        cache: true
    };

    $(".packageList").select2({
        ajax: ajaxOptions,
        width: 'style',
        minimumInputLength: 0,
    });

    $('.packageList').on('select2:select', function(e){

        var elem = e.params.data;
        self.selectedView.setPackage(self.packages[elem.id]);
        self.selectedView.refresh();
    })

}