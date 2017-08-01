var UTILS = {};
//http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
UTILS.getParams = url => {
  var qd = {};
  if (url) url.substr(1).split("&").forEach(item => {let [k,v] = item.split("="); v = v && decodeURIComponent(v); (qd[k] = qd[k] || []).push(v)})
  Object.keys(qd).forEach(function(x){
    if(qd[x].length==1){
      qd[x] = qd[x][0];
    }
  })
  return qd;
};