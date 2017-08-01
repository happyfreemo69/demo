/**
 * [LoginView description]
 * @param {[type]} node      [description]
 * @param {[type]} userd     [description]
 */
function LoginView(node, userd){
    this.node = node;
    this.userd = userd;
    this._onlogged = ()=>{}
}
LoginView.prototype.on = function(k, func){
    this._onlogged = func;
}
LoginView.prototype.showOk = function(){
    [...document.querySelectorAll('.login-hidden')].forEach(x=>{
        x.classList.remove('login-hidden');
    })
    this.node.innerHTML = '';
}
LoginView.prototype.init = function(){
    var self = this;
    this.render();
    var o = localStorage.getItem('user');
    if(o){
        var user = JSON.parse(o);
        if(Date.now() < parseInt(user.expiresAt, 10)){
            self._onlogged(user);
            return this.showOk();
        }
    }
    this.node.getElementsByTagName('form')[0].onsubmit = function(e){
        try{
            var username = this.username.value;
            var password = this.password.value;
            var t = Date.now();
            self.userd.logMe({username: username, password: password}).then(function(user){
                user.expiresAt = t+ parseInt(user.expires_in,10)*1000;
                localStorage.setItem('user', JSON.stringify(user));
                self._onlogged(user);
                self.showOk();
            }).catch(function(e){
                console.log(e);
                alert('no '+JSON.stringify(e));
            })
        }catch(e){
            console.log('e :' , e);
            return false;
        }
        e.preventDefault();
        return false;
    }
}

LoginView.prototype.render = function(){
    return this.node.innerHTML = this.template();
}
LoginView.prototype.template = function(){

    var str = `<form action="#" method="post">
          username: <input name="username" type="text"/><br/>
          pwd: <input name="password" type="password"/>
          <input type="submit" value="logme"/>
      </form>
      <div id="result"></div>`;
    return str;

}