var synty = (function(base){
    var opts = {base:base};

    function _get(o, url){
        if(!o){o={}}
        return $.ajax({
            type: "GET",
            url: opts.base+url,
            beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'bearer '+(o.access_token||exports.cred.access_token));},
        }).catch(function(e){
            return Promise.reject(e);
        })
    }

    function _post(o, url, body){
        if(!o){o={}}
        return $.ajax({
            type: "POST",
            url: opts.base+url,
            contentType : 'application/json',
            data: JSON.stringify(body),
            beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'bearer '+(o.access_token||exports.cred.access_token));},
        }).catch(function(e){
            return Promise.reject(e);
        })
    }

    function _patch(o, url, body){
        if(!o){o={}}
        return $.ajax({
            type: "PATCH",
            url: opts.base+url,
            contentType : 'application/json',
            data: JSON.stringify(body),
            beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'bearer '+(o.access_token||exports.cred.access_token));},
        }).catch(function(e){
            return Promise.reject(e);
        })
    }
    function getMe(o){
        return _get(o, '/v1/me');
    }

    var exports = {cred:{}};
    exports.getRawCategories = function(o={}){
        return _get(o, '/v1/admin/categories?limit=1000');
    }
    exports.getApps = function(o={}){
        return _get(o, '/v1/admin/apps?limit=1000');
    }
    exports.getTree = function(o={}, where){
        return _get(o, '/v1/admin/categories?appId='+where.appId);
    }
    exports.patchCateg = function(o = {}, where, body){
        return _patch(o, '/v1/admin/categories/'+where.id, body);
    }
    exports.copyCateg = function(o = {}, where){
        return _post(o, '/v1/admin/categories/'+where.id+'/copies', {});
    }
    exports.copyApp = function(o = {}, where, body){
        return _post(o, '/v1/admin/apps/'+where.id+'/copies', body);
    }
    exports.createApp = function(o = {}, where, body){
        return _post(o, '/v1/admin/apps', body);
    }
    exports.patchCity = function(o={}, where, body){
        return _patch(o, '/v1/admin/cities/'+where.id, body);
    }
    exports.patchCampus = function(o={}, where, body){
        return _patch(o, '/v1/admin/campuses/'+where.id, body);
    }
    exports.patchSyndic = function(o={}, where, body){
        return _patch(o, '/v1/admin/syndics/'+where.id, body);
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