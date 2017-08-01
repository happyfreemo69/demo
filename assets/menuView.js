function MenuView(node, userd){
    this.node = node;
}
MenuView.prototype.init = function(){
    var self = this;
    this.render();
}

MenuView.prototype.render = function(){
    return this.node.innerHTML = this.template();
}
MenuView.prototype.template = function(){

    var str = `<div class="login-override login-hidden pure-menu pure-menu-horizontal header">
        <a href="/" class="pure-menu-heading pure-menu-link">HOME</a>
        <ul class="pure-menu-list">
            <li class="pure-menu-item"><a href="/pages/apps.html" class="pure-menu-link">Apps</a></li>
            <li class="pure-menu-item"><a href="/pages/categs/list.html" class="pure-menu-link">Categs</a></li>
            <li class="pure-menu-item"><a href="/pages/packages.html" class="pure-menu-link">Packages</a></li>
        </ul>
    </div>`;
    return str;

}