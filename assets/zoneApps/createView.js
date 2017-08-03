function CreateView(node, synty){
    this.synty = synty;
    this.node = node;
    this.geometry = [];//[0,0,1,0,1,1,0,1];
    var jNode = $(node)
    this.h_reference = jNode.find('input[name=reference]')[0];
    this.h_name = jNode.find('input[name=name]')[0];
    this.h_app = jNode.find('select')[0];
    this.apps = [];
    this.me = null;
}
CreateView.prototype.init = function(){
    var self = this;
    $('form', this.node).submit(e=>{
      try{
        var o = {};
        [this.h_reference, this.h_name, this.h_app].forEach(x=>{
          var val = $(x).val();
          if(!val){
            alert(x.name+' is mandatory');
            throw 'invalid form';
          }
          o[x.name] = val;
        });
        if(!this.geometry){
          throw 'geometry required';
        }
        o.geometry = this.geometry.join(',');
        //TODO HERE
        self.synty.post({},self.me.links.moderatedCampuses, o).then(()=>{
          window.location.reload();
        }).catch(e=>{
          alert(JSON.stringify(e));
        })
        e.preventDefault();
        return false;
      }
      e.preventDefault();
      return false;
    })
}
CreateView.prototype.render = function(){
    var options = this.apps.map(x=>{
      return '<option value="'+x.id+'">'+x.name+'</option>'
    })
    this.h_app.innerHTML = `${options}`;
    return this;
}
CreateView.prototype.show = function(){
    $(this.node).removeClass('hidden')
    return this;
}
CreateView.prototype.initMap = function(){
    var self = this;
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 45.7804785, lng: 4.8073978},
      zoom: 19
    });
    var allOverlays = [];
    var drawingControlOptions = {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: ['polygon']
    }
    var drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: drawingControlOptions,
      circleOptions: {
        //fillColor: '#ffff00',
        //fillOpacity: 1,
        clickable: false,
        editable: true,
        zIndex: 1
      }
    });
    drawingManager.setMap(map);
    drawingControlOptions.drawingModes.forEach(x=>{
      google.maps.event.addListener(drawingManager, x+'complete', function(overlay) {
        allOverlays.forEach(y=>y.setMap(null));
        allOverlays = [];
        allOverlays.push(overlay);
        self.geometry = overlay.getPath().getArray().reduce((arr,x)=>{
          return arr.concat([x.lng(), x.lat()]);
        },[]);
      });  
    })
}