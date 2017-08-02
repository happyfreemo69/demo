function CreateView(node){
    this.node = node;
    this.polygon = null;
    var jNode = $(node)
    this.h_reference = jNode.find('input[name=reference]')[0];
    this.h_name = jNode.find('input[name=name]')[0];
    this.h_app = jNode.find('select')[0];
    this.apps = [];
}
CreateView.prototype.init = function(){
    $('form', this.node).submit(e=>{
      try{
        var o = {};
        [this.h_reference, this.h_name, this.h_app].forEach(x=>{
          console.log('iter ', x)
          var val = $(x).val();
          if(!val){
            alert(x.name+' is mandatory');
            throw 'invalid form';
          }
          o[x.name] = val;
        });
        if(!this.polygon){
          throw 'polygon required';
        }
        o.geometry = this.polygon;
        return synty.createCampus({},{},o).then(()=>{
          alert('zone créée!!');
        }).catch(e=>{
          alert(JSON.stringify(e));
        })
      }catch(e){
        console.log('you suck ', e)
      }
      e.preventDefault();
      return false;
    })
}
CreateView.prototype.render = function(){
    console.log('GO ,' )
    console.log('render createView');
    var options = this.apps.map(x=>{
      return '<option value="'+x.id+'">'+x.name+'</option>'
    })
    this.h_app.innerHTML = `${options}`;
    console.log('ok :' , options)
    return this;
}
CreateView.prototype.show = function(){
    console.log('GO ,' )
    $(this.node).removeClass('hidden')
    return this;
}
CreateView.prototype.initMap = function(){
    console.log('GO uubtobobi ', document.getElementById('map'));
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
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
      google.maps.event.addListener(drawingManager, x+'complete', function(event) {
        allOverlays.forEach(y=>y.setMap(null));
        allOverlays = [];
        this.polygon = event;
        allOverlays.push(event);
        console.log('COMPLETE');
        var coordinatesArray = this.polygon.getPath().getArray().reduce((arr,x)=>{
          return arr.concat([x.lng(), x.lat()]);
        },[])
        console.log('got ', coordinatesArray)
        if (event.type == 'circle') {
          var radius = event.overlay.getRadius();
        }
      });  
    })
}