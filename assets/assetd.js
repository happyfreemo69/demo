var assetd = (function(base){
    var opts = {base:base};

    function _get(o, url){
        if(!o){o={}}
            console.log('URL :', url)
        return $.ajax({
            type: "GET",
            url: opts.base+url,
            beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'bearer '+(o.access_token||exports.cred.access_token));},
        }).catch(function(e){
            return Promise.reject(e);
        })
    }

    var exports = {cred:{}};
    /**
     * @param  {htmlfilename} file [description]
     * @return {[type]}      [description]
     */
    exports.createAsset = function(file){
        var fd = new FormData();    
        fd.append('upload', file);
        return $.ajax({
            url: opts.base+'/upload/pictures',
            data: fd,
            processData: false,
            contentType: false,
            type: 'POST',
            beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'bearer '+exports.cred.access_token);},
        }).catch(e=>{return Promise.reject(e)})
    }

    exports.conf = function(k,v){
        if(k in opts){
            opts[k] = v;
            return;
        }
        throw k+'- unrecognized option';
    }
    return exports;
})('/');