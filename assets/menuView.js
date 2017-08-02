function MenuView(node, loginView){
    this.node = node;
    this.loginView = loginView;
}
MenuView.prototype.init = function(){
    var self = this;
    this.render();
}

MenuView.prototype.render = function(){
    var x = this.node.innerHTML = this.template();
    if(this.loginView){
        $('a.logout').click((e)=>{
            this.loginView.logout();
        })
    }
    return x;
}
MenuView.prototype.template = function(){

    var str = `<div class="login-override login-hidden pure-menu pure-menu-horizontal header">
        <a href="/" class="pure-menu-heading pure-menu-link">HOME</a>
        <ul class="pure-menu-list">
            <li class="pure-menu-item"><a href="/" class="pure-menu-link logout">logout</a></li>
        </ul>
    </div>`;
    return str;
}