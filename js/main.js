$(document).ready(function () {
    $('#intput-project-search').selectize({
        create: false, 
        searchField: ['name', 'servers'],
        valueField: 'name',
        labelField: 'name',
        options: [
            { name: 'zadmin', servers: "10.30.80.16,10.30.58.126" },
            { name: 'authen-pc', servers: "10.30.80.16,10.30.58.126" },
            { name: 'zalo-webpc-api-profile', servers: "10.30.80.16,10.30.58.126" },
            { name: 'zalo-webpc-api-friend', servers: "10.30.80.16,10.30.58.126" }
        ],
        render: {
            item: function (item, escape) {
                return '<div>' +
                    (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
                    '</div>';
            },
            option: function (item, escape) {
                return '<div>' +
                    '<div class="label">' + escape(item.name) + '</div>' +
                    '<div class="caption">' + escape(item.servers) + '</div>' +
                    '</div>';
            }
        }
    });

    $('.input-server-ips').selectize({
        delimiter: ',',
        persist: false,
        create: true
    });
});