function CategView(nodeList){
    var self = this;
    this.hList = nodeList;
    this.categs = [];
}

CategView.categIconHtml = function(categ){
    return '<img height="30" width="30" style="background-color:#'+categ.color+';" src="'+categ.iconUrl+'">';
}
//https://datatables.net/examples/data_sources/js_array.html
CategView.prototype.refreshList = function(){
    //paginated stuff
    var self = this;
    var trunc = window.location.toString().replace('list.html', 'view.html');
    var fields = {
        iconUrl:{fn:x=>x.iconUrl && CategView.categIconHtml(x)||' '},
        name: {fn:x=>'<a href="'+trunc+'?categId='+x.id+'">'+x.name+'</a>'||'none'},
        tags:{fn:x=>x.tags},
        model:{fn:x=>x.model||'none'},
        appTypes:{fn:x=>'appTypes'},
        id:{fn:x=>x.id||'none'}
    }
    var fieldValues = Object.keys(fields).map(x=>fields[x]);
    var dataSet = this.categs.map(x=>{
        return fieldValues.map(v=>v.fn(x));
    })
    //dataSet = dataSet.slice(0,1)
    $(this.hList).DataTable({
        data: dataSet,
        deferRender:true,
        columns: [
            { title: "iconUrl" },
            { title: "Name" },
            { title: "tags" },
            { title: "model" },
            { title: "appTypes" },
            { title: 'id'}
        ],
        "columnDefs": [
            {
                // The `data` parameter refers to the data for the cell (defined by the
                // `data` option, which defaults to the column being worked with, in
                // this case `data: 0`.
                "render": function ( data, type, row ) {
                    var str = '';
                    var categId = row[row.length-1];
                    var categ = self.categs[0].categIdToCateg[categId];
                    if(!categ){
                        return 'maxime is a moron';
                    }
                    var sType = categ.getApps().reduce((acc,x)=>{
                        acc.add(x.type);
                        return acc;
                    }, new Set);
                    return [...sType].sort((a,b)=>a.localeCompare(b)).join(',');
                },
                "targets": Object.keys(fields).indexOf('appTypes')
            }
        ]
    });
}

CategView.prototype.init = function(){}
