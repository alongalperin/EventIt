$(function () {
    $('#datetimepicker1').datetimepicker();
});

$('#create-form').on('submit', function(e) {
    e.preventDefault();
    $("#list_errors").empty();

    let date = $('#datetimepicker1').datetimepicker("viewDate");
    let name = $('#name').val().trim();
    let ownerEmail = $('#ownerEmail').val().trim();

    if (ownerEmail.length === 0) {
        $('#list_errors').append('<li>Please supply your emeil address</li>');
        return;
    }

    if (name.length === 0) {
        $('#list_errors').append('<li>Please choose a name to the event</li>');
        return;
    }

    if ($('.datetimepicker-input').val().trim() ==0) {
        $('#list_errors').append('<li>Please select a date</li>');
        return;
    }

    $.ajax({
        type: 'POST',
        data: JSON.stringify({
            ownerEmail: ownerEmail,
            date : date, 
            name : name,
            address : mapAddress,
            lat: lat,
            lng: lng
        }),
        contentType: 'application/json',
        url: '/event',
        success: function(manageId){
            $('#myModal').modal('show');
            $('#btnCloseModal').on('click', function(){
                window.location = "/manage.html?manageId=" + manageId;    
            });
        }
    });
});

