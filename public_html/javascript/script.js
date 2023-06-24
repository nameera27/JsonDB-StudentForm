var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIML = "/api/iml";
var jpdbIRL = "/api/irl";
var studDBName = "SCHOOL-DB";
var studRelationname = "STUDENT-TABLE";
var connToken = "90933110|-31949318255442090|90951212";

$("#studid").focus(); 

function resetForm() {   
    $("#studid").val("");    
    $("#studname").val("");   
    $("#studclass").val(""); 
    $("#studdob").val("");
    $("#studaddr").val("");
    $("#studenroll").val(""); 

    $("#studid").prop('disabled', false); 
    $("#save").prop('disabled', true); 
    $("#update").prop('disabled', true); 
    $("#reset").prop('disabled', true); 
    $("#studid").focus();     
} 

function validateData() {    
    var studid, studname, studclass, studdob, studaddr, studenroll;
    studid = $("#studid").val();
    studname = $("#studname").val();   
    studclass = $("#studclass").val(); 
    studdob = $("#studdob").val();
    studaddr = $("#studaddr").val();
    studenroll = $("#studenroll").val(); 
    if (studid === "") {  
        alert("Student ID Required");    
        $("#studid").focus();    
        return "";    
    }      
    if (studname === "") {    
        alert("Student Name is Required");    
        $("#studname").focus();   
        return "";    
    }
    if (studclass === "") {    
        alert("Student Class is Required");    
        $("#studclass").focus();   
        return "";    
    }  
    if (studdob === "") {    
        alert("Student Date of Birth is Required");    
        $("#studdob").focus();   
        return "";    
    }  
    if (studaddr === "") {    
        alert("Student Address is Required");    
        $("#studaddr").focus();   
        return "";    
    }  
    if (studenroll === "") {    
        alert("Student Enrollment Date is Required");    
        $("#studenroll").focus();   
        return "";    
    } 
    var jsonStrObj = {    
        id: studid,
        name: studname,
        class: studclass,
        dob: studdob,
        addr: studaddr,
        enroll: studenroll    
    };      
    return JSON.stringify(jsonStrObj);   
}   

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === '') {
        return '';
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, studDBName, studRelationname);        
    jQuery.ajaxSetup({async: false});    
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);  
    jQuery.ajaxSetup({async: true});            
    resetForm();
    $("#studid").focus();
}

function updateData() {
    $("#update").prop('disabled', true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, studDBName, studRelationname, localStorage.getItem('recno'));
    jQuery.ajaxSetup({async: false});    
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);  
    jQuery.ajaxSetup({async: true}); 
    console.log(resJsonObj);         
    resetForm();
    $("#studid").focus();
}

function getStudIdasJsonObj() {
    var studid = $('#studid').val();
    var jsonStr = {
        id: studid
    };
    return JSON.stringify(jsonStr); 
}

function fillData(jsonObj) {
    SaveRecNo(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#studname').val(record.name);
    $('#studclass').val(record.class);
    $('#studdob').val(record.dob);
    $('#studaddr').val(record.addr);
    $('#studenroll').val(record.enroll);
}

function getStud() {
    var studidJsonObj = getStudIdasJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, studDBName, studRelationname, studidJsonObj);
    jQuery.ajaxSetup({async: false});    
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);  
    jQuery.ajaxSetup({async: true});

    if  (resJsonObj.status === 400) {
        $('#save').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#studname').focus();
    } else if (resJsonObj.status === 200) {
        $('#studid').prop('disabled', true);
        fillData(resJsonObj);

        $('#update').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#studname').focus();
    }
}

function SaveRecNo(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}
 