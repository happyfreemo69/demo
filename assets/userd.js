var userd = (function(base){
    var opts = {base:base};


    var exports = {};
    /**
     * @param  {username:'xx', password:'xx'} o [description]
     * @return {[type]}   [description]
     */
    exports.logMe = function(o){
        o.client_id = 'freemo';
        o.client_secret = 'public';
        o.grant_type = 'password';
        return $.ajax({
            type: "POST",
            url: opts.base+'/oauth/token',//no need for admin pass onto userd
            data: o,
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            dataType:'json'
        });
    }
    exports.conf = function(k,v){
        if(k in opts){
            opts[k] = v;
            return;
        }
        throw k+'- unrecognized option';
    }
    return exports;
})('/')