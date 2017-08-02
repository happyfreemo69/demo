/**
 * [RegisterView description]
 * @param {[type]} node      [description]
 * @param {[type]} userd     [description]
 */
function RegisterView(node, userd){
    this.node = node;
    this.userd = userd;
    this._onlogged = ()=>{}
}
RegisterView.prototype.on = function(k, func){
    this._onlogged = func;
}

RegisterView.prototype.logout = function(){
    return localStorage.removeItem('user');
}
RegisterView.prototype.init = function(){
    var self = this;
    this.render();
    this.node.getElementsByTagName('form')[0].onsubmit = function(e){
        try{
            var email = this.email.value;
            var password = this.password.value;
            var t = Date.now();
            self.userd.register({email: email, password: password}).then(function(user){
                user.expiresAt = t+ parseInt(user.expires_in,10)*1000;
                localStorage.setItem('user', JSON.stringify(user));
                self._onlogged(user);
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

RegisterView.prototype.render = function(){
    return this.node.innerHTML = this.template();
}
RegisterView.prototype.template = function(){

    var str = `<form action="#" method="post">
          email: <input name="email" type="text"/><br/>
          pwd: <input name="password" type="password"/>
          <input type="submit" value="register"/>
      </form>
      <div id="result"></div>`;
    return str;

}