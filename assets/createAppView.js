function CreateAppView(node, app, dfcCategs){
    this.node = node;
    this.app = app;
    this.dfcCategs = dfcCategs;
    this.editCategView = new EditCategView($('#formEditCateg'));
}
CreateAppView.prototype.attachEvents = function(){
    var self = this;
    //Init your list drag and drop after populate it
    var oldContainer;
    $('ol.dragDrop').sortable({
        group: 'nested',
        afterMove: function (placeholder, container) {
            if(oldContainer != container){
                if(oldContainer)
                    oldContainer.el.removeClass("active");
                container.el.addClass("active");
                oldContainer = container;
            }
        },
        onDragStart: function ($item, container, _super) {
            // Duplicate items of the no drop area
            if(!container.options.drop)
                $item.clone().insertAfter($item);
            _super($item, container);
        }
    });

    $('ol.noDrop').sortable({
      group: 'nested',
      drop: false
    });

    $('ol.dragDrop').on('click','.category',function(e){
        var categId = this.getAttribute('data-category_id');
        var categ = self.app.categById(categId);
        self.editCategView.model = categ;
        self.editCategView.cbks.onHide = function(){
            //only the last instance will be concerned anyway
            $(e.target, self.node).find('span').html(categ.copy.name);
        }
        self.editCategView.show();
        return false;
    });

    $('.validateApp').on('click', function(e){
        e.preventDefault();
        $('#sectionAssociateZone').removeClass('hidden');
        self.editCategView.hide();
        $('html,body').animate({scrollTop: $("#sectionAssociateZone").offset().top}, 'slow' );
        //Get FormApp data and send to API
        $('#sectionCreateApp :input').val('');
    });
}

/**
 * get children from categ
 * and return its corresponding list.
 * @param  {[type]} categ [description]
 * @return {[type]}       [description]
 */
CreateAppView.prototype.categToHtml = function(categ){
    return categ.children.map(function(item){
        var str = '<li class="category" data-category_id="' + item.id + '"><span>' + item.name+'</span>';
        if(item.children && item.children.length){
            str += '<ol>'+this.categToHtml(item)+'</ol>';
        }
        str += '</li>';
        return str;
    }, this).join('\n');
}
CreateAppView.prototype.appToHtml = function(){
    return this.categToHtml(this.app.json);
}

CreateAppView.prototype.render = function(){
    $('#sectionCreateApp').removeClass('hidden');
    $('html,body').animate({scrollTop: $("#sectionCreateApp").offset().top}, 'slow' );

    //Populate categ App
    $('#categApp .dragDrop').html(this.appToHtml(this.app));

    //Populate default categ
    $('#categDefault .noDrop').html(this.categToHtml({children:this.dfcCategs}));
    this.attachEvents();
}


function EditCategView(node, cbks){
    this.node = node;
    this.model = {};
    this.inited = false;
    this.cbks = {onHide:function(){}}
    Object.keys(cbks||{}).forEach(function(x){
        this.cbks[x] = cbks[x];
    }, this);

    this.tags = {};
    this.tags.frName = this.node.find('#frName');
    this.tags.enName = this.node.find('#enName');
    this.tags.color = this.node.find('#color');
    this.tags.placeHolder = this.node.find('#placeHolder').prev().find('img')[0];
    this.tags.iconUrl = this.node.find('#iconUrl').prev().find('img')[0];
}
EditCategView.prototype.attachEvents = function(){
    var old;
    var self = this;
    $('#colorPanel').on('click', function(e){
        old && old.classList.remove('selected');
        e.target.classList.add('selected');
        old = e.target;
        $('#color').val(e.target.getAttribute('data-color'));
    });

    $('.validateCateg').on('click',function(e){
        var o = self.model.copy;
        o.name = self.tags.frName.val();
        o.enName = self.tags.enName.val();
        o.color = self.tags.color.val();
        o.placeHolder = self.tags.placeHolder.src;
        o.iconUrl = self.tags.iconUrl.src;
        console.log('got b64:', o.placeHolder);
        e.preventDefault();
        self.hide();
    });
    document.getElementById("placeHolder").onchange = function () {
        var reader = new FileReader();
        reader.onload = function (e) {
            self.tags.placeHolder.src = e.target.result;
        };
        reader.readAsDataURL(this.files[0]);
    }
    document.getElementById("iconUrl").onchange = function () {
        var reader = new FileReader();
        reader.onload = function (e) {
            self.tags.iconUrl.src = e.target.result;
        };
        reader.readAsDataURL(this.files[0]);
    }
}
EditCategView.prototype.render = function(){
    this.model.copy = $.extend({}, this.model, this.model.copy);
    var o = this.model.copy;
    this.tags.frName.val(o.name);
    this.tags.enName.val(o.enName);
    this.tags.color.val(o.color);
    this.tags.placeHolder.src = o.placeHolder;
    this.tags.iconUrl.src = o.iconUrl;
    if(!this.inited){
        this.attachEvents();
        this.inited = true;
    }
}
EditCategView.prototype.hide = function(){
    this.node.addClass('hidden');
    this.render();
    this.cbks.onHide();
}
EditCategView.prototype.show = function(){
    this.node.removeClass('hidden');
    this.render();
}