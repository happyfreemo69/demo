function BoView(node){
    console.log('gibin ', node)
    this.node = node;
}
BoView.prototype.render = function(){
    console.log('this.node ', this.node)
    $(this.node).find('a').attr('href', CONSTANTS.boUrl)
    return this;
}
BoView.prototype.show = function(){
    $(this.node).removeClass('hidden')
    return this;
}