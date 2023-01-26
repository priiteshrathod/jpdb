var jpdbBaseURL = 'http://ai.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var studDBName = "STUD-DB";
var studRelationName = "StudData";
var connToken = "90936571|-31948846965960543|90934225";

$('#studid').focus();

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno' , lvData.rec_no);
}

function getStudIdAsJsonObj(){
    var studid = $('#empid').val();
    var jsonStr = {
        id: studid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#studname').val(record.name);
    $('#studrn').val(record.rn);
    $('#studclass').val(record.class);
    $('#studdob').val(record.dob);
    $('#studaddress').val(record.address);
    $('#studdoe').val(record.doe);
}

function resetForm() {
    $('#studname').val("");
    $('#studrn').val("");
    $('#studclass').val("");
    $('#studdob').val("");
    $('#studaddress').val("");
    $('#studdoe').val("");
    $('#studrn').prop('disabled' , false);
    $('#save').prop('disabled' , false);
    $('#change').prop('disabled' , false);
    $('#reset').prop('disabled' , false);
    $('#studrn').focus();
}

function validateData(){
    var studrn, studname , studclass, studdob, studaddress, studdoe;
    studrn = $("#studrn").val();
    studname = $("#studname").val();
    studclass = $("#studclass").val();
    studaddress = $("#studaddress").val();
    studdoe = $("#studdoe").val();
    studdob = $("#studdob").val();

    if(studrn === ''){
        alert('Student Roll No. Missing');
        $('#studrn').focus();
        return "";
    }
    if(studname === ''){
        alert('Student Name No. Missing');
        $('#studname').focus();
        return "";
    }
    if(studclass === ''){
        alert('Student class No. Missing');
        $('#studclass').focus();
        return "";
    }
    if(studaddress === ''){
        alert('Student address No. Missing');
        $('#studaddress').focus();
        return "";
    }
    if(studdob === ''){
        alert('Student dob No. Missing');
        $('#studdob').focus();
        return "";
    }
    if(studdoe === ''){
        alert('Student doe No. Missing');
        $('#studdoe').focus();
        return "";
    }

    var jsonStrObj = {
        id: studrn,
        name: studname,
        class: studclass,
        dob: studdob,
        doe: studdoe,
        address: studaddress
    };
    return JSON.stringify(jsonStrObj);
}

function getStud(){
    var studIdJsonObj = getStudIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, studDBName, studRelationName, studIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if(resJsonObj.status === 400){
        $('#save').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#studname').focus();
    }
    else if(resJsonObj.status === 200){
        $('#studrn').prop('disabled', true);
        fillData(resJsonObj);

        $('#change').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#studname').focus();
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if(jsonStrObj === ''){
        return '';
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, studDBName, studRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $('#studrn').focus();
}

function changeData(){
    $('#change').prop('disabled', true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, studDBName, studRelationName, localStorage.getItem('recno'));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $('#studrn').focus();
}
