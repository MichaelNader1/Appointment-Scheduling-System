
var routeURL = location.protocol + "//" + location.host;
var calendar;

$(document).ready(function () {
    InitializeCalendar();
    $("#appointmentDate").kendoDateTimePicker({
        value: new Date(),
        dateInput: false
    });
});

function InitializeCalendar() {
    try {
        var calendarEl = document.getElementById('calender');
        if (calendarEl != null) {
            calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prev,next,today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                selectable: true,
                editable: false,
                select: function (event) {
                    onShowModal(event, null);
                },
                eventDisplay: 'block',
                events: function (fetchInfo, successCallback, failureCallback) {
                    $.ajax({
                        url: routeURL + '/api/Appointment/GetCalenderData?doctorId=' + $("#doctorId").val(),
                        type: 'GET',
                        dataType: 'JSON',
                        success: function (response) {
                            var events = [];
                            if (response.status === 1) {
                                $.each(response.dataenum, function (i, data) {
                                    events.push({
                                        title: data.title,
                                        description: data.description,
                                        start: data.startDate,
                                        end: data.endDate,
                                        backgroundColor: data.isDoctorApproved ? "#28a745" : "#dc3545",
                                        borderColor: "#162466",
                                        textColor: "white",
                                        id: data.id
                                    });
                                });
                            }
                            successCallback(events);
                        },
                        error: function (xhr) {
                            $.notify("Error", "error");
                        }
                    });
                },
                eventClick: function (info) {
                    getEventDetailsByEventId(info.event);
                }
            });

            calendar.render();
        }
    } catch (e) {
        alert(e);
    }
}

function onShowModal(obj, isEventDetail) {
    if (isEventDetail != null) {

        $("#title").val(obj.title);
        $("#description").val(obj.description);
        $("#appointmentDate").val(obj.startDate);
        $("#duration").val(obj.duration);
        $("#doctorId").val(obj.doctorId);
        $("#patientId").val(obj.patientId);
        $("#id").val(obj.id);
        $("#lblPatientName").html(obj.patientName);
        $("#lblDoctorName").html(obj.doctorName);
        if (obj.isDoctorApproved) {
            $("#lblStatus").html('Approved');
            $("#btnConfirm").addClass("d-none");
            $("#btnSubmit").addClass("d-none");
        }
        else {
            $("#lblStatus").html('Pending');
            $("#btnConfirm").removeClass("d-none");
            $("#btnSubmit").removeClass("d-none");
        }
        $("#btnDelete").removeClass("d-none");
    }
    else {
        $("#appointmentDate").val(obj.startStr + " " + new moment().format("hh:mm A"));
        $("#id").val(0);
        $("#btnDelete").addClass("d-none");
        $("#btnSubmit").removeClass("d-none");
    }
    $("#appointmentInput").modal("show");
}

function onCloseModal() {
    $("#apointmentForm")[0].reset();
    $("#id").val(0);
    $("#title").val('');
    $("#description").val('');
    $("#appointmentDate").val('');
    $("#appointmentInput").modal("hide");
}

function onSubmitForm() {
    if (checkValidation()) {
        var requestData = {
            Id: parseInt($("#id").val()),
            Title: $("#title").val(),
            Description: $("#description").val(),
            StartDate: $("#appointmentDate").val(),
            Duration: $("#duration").val(),
            DoctorId: $("#doctorId").val(),
            PatientId: $("#patientId").val(),
        };

        $.ajax({
            url: routeURL + '/api/appointment/SaveCalenderData',
            type: 'POST',
            data: JSON.stringify(requestData),
            contentType: 'application/json',
            success: function (response) {
                console.log(response);
                if (response.status === 1 || response.status === 2) {
                    calendar.refetchEvents(); 
                    $.notify(response.message, "success");
                    onCloseModal(); 
                } else {
                    $.notify(response.message, "error");
                    onCloseModal();  
                    calendar.refetchEvents(); 
                }
            },
            error: function (xhr) {
                //$.notify("Error", "error");
                onCloseModal(); 
                calendar.refetchEvents(); 

            }
        });
    }
}

function checkValidation() {
    var isValid = true;
    if ($("#title").val() === undefined || $("#title").val() === "") {
        isValid = false;
        $("#title").addClass('error');
    }
    else {
        $("#title").removeClass('error');
    }

    if ($("#appointmentDate").val() === undefined || $("#appointmentDate").val() === "") {
        isValid = false;
        $("#appointmentDate").addClass('error');
    }
    else {
        $("#appointmentDate").removeClass('error');
    }

    return isValid;
}

function getEventDetailsByEventId(info) {
    $.ajax({
        url: routeURL + '/api/Appointment/GetCalenderDataById/' + info.id,
        type: 'GET',
        dataType: 'JSON',
        success: function (response) {
            if (response.status === 1 && response.dataenum !== undefined) {
                onShowModal(response.dataenum, true); // Show the modal with event details
            }
        },
        error: function (xhr) {
            $.notify("Error", "error");
        }
    });
}

function onDoctorChange() {
    calendar.refetchEvents(); // Refresh the calendar after doctor change
}

function onDeleteAppointment() {
    var id = parseInt($("#id").val());
    $.ajax({
        url: routeURL + '/api/Appointment/DeleteAppointment/' + id,
        type: 'GET',
        dataType: 'JSON',
        success: function (response) {

            if (response.status === 1) {
                $.notify(response.message, "success");
                calendar.refetchEvents();
                onCloseModal();
            }
            else {

                $.notify(response.message, "error");
            }
        },
        error: function (xhr) {
            $.notify("Error", "error");
        }
    });
}

function onConfirm() {
    var id = parseInt($("#id").val());
    $.ajax({
        url: routeURL + '/api/Appointment/ConfirmAppointment/' + id,
        type: 'GET',
        dataType: 'JSON',
        success: function (response) {

            if (response.status === 1) {
                $.notify(response.message, "success");
                calendar.refetchEvents();
                onCloseModal();
            }
            else {

                $.notify(response.message, "error");
            }
        },
        error: function (xhr) {
            $.notify("Error", "error");
        }
    });
}




//var routeURL = location.protocol + "//" + location.host;
//var calendar;

//$(document).ready(function () {
//    InitializeCalendar();
//    $("#appointmentDate").kendoDateTimePicker({
//        value: new Date(),
//        dateInput: false
//    });

//});
//var calendar;
//function InitializeCalendar() {
//    try {
//        var calendarEl= document.getElementById('calender');
//        if (calendarEl != null) {
//            calendar = new FullCalendar.Calendar(calendarEl, {
//                initialView: 'dayGridMonth',
//                headerToolbar: {
//                    left: 'prev,next,today',
//                    center: 'title',
//                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
//                },
//                selectable: true,
//                editable: false,
//                select: function (event) {
//                    onShowModal(event, null);
//                },
//                eventDisplay: 'block',
//                events: function (fetchInfo, successCallback, failureCallback) {
//                    $.ajax({
//                        url: routeURL + '/api/Appointment/GetCalenderData?doctorId=' + $("#doctorId").val(),
//                        type: 'GET',
//                        dataType: 'JSON',
//                        success: function (response) {
//                            var events = [];
//                            if (response.status === 1) {
//                                $.each(response.dataenum, function (i, data) {
//                                    events.push({
//                                        title: data.title,
//                                        description: data.description,
//                                        start: data.startDate,
//                                        end: data.endDate,
//                                        backgroundColor: data.isDoctorApproved ? "#28a745" : "#dc3545",
//                                        borderColor: "#162466",
//                                        textColor: "white",
//                                        id: data.id
//                                    });
//                                })
//                            }
//                            successCallback(events);
//                        },
//                        error: function (xhr) {
//                            $.notify("Error", "error");
//                        }
//                    });
//                },
//                eventClick: function (info) {
//                    getEventDetailsByEventId(info.event);
//                }

//            });

//            calendar.render();
//        }
//    } catch (e) {
//        alert(e);
//    }
//}

//function onShowModal(obj, isEventDetail) {

//    if (isEventDetail != null) {

//        $("#title").val(obj.title);
//        $("#description").val(obj.description);
//        $("#appointmentDate").val(obj.startDate);
//        $("#duration").val(obj.duration);
//        $("#doctorId").val(obj.doctorId);
//        $("#patientId").val(obj.patientId);
//        $("#id").val(obj.id);

//        }

//    $("#appointmentInput").modal("show");
//}
//function onCloseModal() {
//    $("#appointmentInput").modal("hide");
//}
//function onCloseModal() {
//    $("#apointmentForm")[0].reset();
//    $("#id").val(0);
//    $("#title").val('');
//    $("#description").val('');
//    $("#appointmentDate").val('');
//    $("#appointmentInput").modal("hide");
//}

//function onSubmitForm() {
//    if (checkValidation()) {
//        var requestData = {
//            Id: parseInt($("#id").val()),
//            Title: $("#title").val(),
//            Description: $("#description").val(),
//            StartDate: $("#appointmentDate").val(),
//            Duration: $("#duration").val(),
//            DoctorId: $("#doctorId").val(),
//            PatientId: $("#patientId").val(),
//        };

//        $.ajax({
//            url: routeURL + '/api/appointment/SaveCalenderData',
//            type: 'POST',
//            data: JSON.stringify(requestData),
//            contentType: 'application/json',
//            success: function (response) {
//                console.log(response);
//                if (response.status === 1 || response.status === 2) {
//                    calendar.refetchEvents();
//                    $.notify(response.message, "success");
//                    onCloseModal();  // Move this inside success callback to ensure it's called only after the request succeeds
//                } else {
//                    $.notify(response.message, "error");
//                    onCloseModal();  // Hide the modal even on failure
//                    calendar.refetchEvents();

//                }
//            },
//            error: function (xhr) {
//                $.notify("Error", "error");
//                onCloseModal(); // Hide the modal on error as well
//            }
//        });
//    }
//}


//function checkValidation() {
//    var isValid = true;
//    if ($("#title").val() === undefined || $("#title").val() === "") {
//        isValid = false;
//        $("#title").addClass('error');
//    }
//    else {
//        $("#title").removeClass('error');
//    }

//    if ($("#appointmentDate").val() === undefined || $("#appointmentDate").val() === "") {
//        isValid = false;
//        $("#appointmentDate").addClass('error');
//    }
//    else {
//        $("#appointmentDate").removeClass('error');
//    }

//    return isValid;

//}
//function getEventDetailsByEventId(info) {
//    $.ajax({
//        url: routeURL + '/api/Appointment/GetCalenderDataById/' + info.id,
//        type: 'GET',
//        dataType: 'JSON',
//        success: function (response) {
//            if (response.status === 1 && response.dataenum !== undefined) {
//                onShowModal(response.dataenum, true); // Show the modal with event details
//            }
//        },
//        error: function (xhr) {
//            $.notify("Error", "error");
//        }
//    });
//}
//function onDoctorChange() {
//    calendar.refetchEvents();
//}