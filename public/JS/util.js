function setAppWithEventDetails(app, manageId){
    // app is the vueJS app of guest page
    return new Promise((resolve, reject) => {
        $.get("/event/" + manageId, function(data, status){
            app.eventName = data.name;
            app.address = data.address;
            const date = new Date(data.date);
            app.time = moment(date).format('DD/MM/YYYY hh:mm');
            app.lat = data.lat;
            app.lng = data.lng;

            resolve();
        });
    });
}

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}