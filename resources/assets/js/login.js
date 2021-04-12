import "core-js/stable";
import "regenerator-runtime/runtime";

import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle';

import axios from 'axios';
import Swal from 'sweetalert2';

import  isObject from 'lodash/isObject';
import  isNull from 'lodash/isNull';

//import 'lodash/isNull';

var _errorList = {

    "GeneralError": "Lo sentimos, algo inesperado pasó, por favor recarga el sitio e intenta de nuevo.",
    "InternalServerError": "Lo sentimos, algo inesperado pasó, por favor recarga el sitio e intenta de nuevo.",
    "BadRequest": "Lo sentimos, algo inesperado pasó, por favor recarga el sitio e intenta de nuevo.",
    'PageExpired':'Lo sentimos su sesión ha expirado, please reload site and try again.',
    'Forbidden':'Sorry your Session has expired, por favor recarga el sitio e intenta de nuevo.',
    'RequestTimeout': 'Esta acción toma mucho tiempo, por favor espera e intente nuevamente.',

    'username' : {
        'required': 'requerido',
        'invalid': 'Ingrese un nombre de usuario vàlido.',
        'notfound': 'Verifique sus credenciales (usuario/contraseña)'
    },
    'password' : {
        'required': 'requerido',
        'invalid': 'Ingrese su contraseña.'
    }

};

var sendingRequest = false;

$(document).ready(function(){
    
    const $form = $('#login-form');
    const $btnSubmit = $('#btn-login-submit',$form);

    $form    
        .attr({
            'method' : 'post',
            'action' : 'javascript:void(0)'
        })
        .on('submit',function(e){
            e.preventDefault();
            return false;
        })
    ;

    $(":input", $form).filter(':enabled')
        .on('keydown',function(e) {
            e.stopPropagation();
                
            if (e.which != 13) {
                return;
            }
    
            if($(this).is('textarea')) {
                return;
            }
    
            if($(this).is('select.select2picker')) {
                return;
            }
    
            return isValid($form);
        })
    ;
    
    // send data
    $btnSubmit.off().on('click', async function(e){
        e.preventDefault();

        const result = isValid($form);

        if(result) {

            try {

                await callServiceCreate('login-form');

            } catch (error) {

                //console.log(error);

            }

        }
    }) 

});

const isValid = ($container, onChange = false) => {
    
    //console.log('is-valid');
    cleanErrors($container);

    let rulesList = {};    

    var result = validateFormFields($container);
    //console.log(result);
    if (result === true) {
        return true;
    }

    showError(result);

    return false;
}

const validateFormFields = ($container) => {
    var result = {};

    $(':input,select',$container).each(function(index,element){
        var $this = $(element);
        var typeInput =  $this.prop('type');
        var value = $this.val();

        //console.log(typeInput);

        if(typeInput !== 'button') {
            switch (typeInput) {
                case 'text':
                    if(
                        value.trim() === ""
                    ){
                        
                        result = {
                            "error" : $this.prop('name'),
                            "input_type" : $this.prop('type'),
                            "errorType" : 'required'
                        }

                    }
                    break;
                case 'email':
                    //console.log(value);
                    if(
                        value.trim() === ""
                    ){
                        
                        result = {
                            "error" : $this.prop('name'),
                            "input_type" : $this.prop('type'),
                            "errorType" : 'required'
                        }

                    } else { 

                        if(!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value))) {
                            
                            result = {
                                "error" : $this.prop('name'),
                                "input_type" : $this.prop('type'),
                                "errorType" : 'invalid'
                            }
                        }

                    }

                    break;
            
                case 'checkbox':
                
                    if(
                        !$this.prop('checked') && 
                        $this.prop('required')
                    ) {
                        result = {
                            "error" : $this.prop('name'),
                            "input_type" : $this.prop('type'),
                            "errorType" : 'required'
                        }
                    }
                    break;
                case 'select-one':
                    if(value.trim() == ""){
                        result = {
                            "error" : $this.prop('name'),
                            "input_type" : $this.prop('type'),
                            "errorType" : 'required'
                        } 
                    }
                    break;
                case 'password':
                    if(value.trim() == ""){
                        result = {
                            "error" : $this.prop('name'),
                            "input_type" : $this.prop('type'),
                            "errorType" : 'required'
                        } 
                    }
                    break;
                default:
                    result = {};
                    break;
            }

        }
        
        if(result.error) {
            return false;
        }
    });


    if(result.error) {
        return result;
    }
    
    return true;
    
}

const cleanErrors = ($container) => {
    $(":input", $container).filter(':enabled,[type="hidden"]:enabled').each(function(){
        var $field = $(this);        
        $field.removeClass("is-invalid");
    });
}

const showError = (error) => {
    var nameInput = error.error;
    var message = _errorList[nameInput][error.errorType];

    var $element = $("#"+nameInput);
    var $containerInput = $element.closest('.col-12');

    console.log(error);
    
    //remove class invalid-feedback
    $element
        .addClass('is-invalid')
    ;

    $containerInput
        .find('.invalid-feedback')
        .empty()
        .append(message)
    ;

    // put focus around the input
    $element.focus();
}

const callServiceCreate = async (formId) => {
    console.log('form id => ', formId);
    let form = document.getElementById(formId);
    let formData = new FormData(form);
    const $form = $('#login-form');
    let $btnSubmit = $form.find('#btn-login-submit');
    
    if(sendingRequest) {
        return;
    }

    sendingRequest = true;

    $btnSubmit.prop('disabled',true)
        .find('.spinner-border')
        .removeClass('d-none')
    ;

    axios.post('/s/service-login', 
            formData  
        )
        .then(function (response) {
            console.log(response);
        
            window.location.href = '/';
            
            form.reset();

        })
        .catch(function (error) {
            
            const errorData = error.response.data;
            let msg = "";
            if(
                isObject(errorData) &&
                !isNull(errorData.error)
            ) {
                
                msg = _errorList[errorData.error];

                if(
                    isObject( _errorList[errorData.error] ) &&
                    !isNull(errorData.errorType)
                ) {
                    console.log( 'msg' ,_errorList[errorData.error][errorData.errorType] );
                    msg = _errorList[errorData.error][errorData.errorType];
                }

            
                
                //console.log( typeof _errorList[errorData.error]);

                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: msg
                })

            }
            
            sendingRequest = false;

            $btnSubmit.prop('disabled',false)
                .find('.spinner-border')
                .addClass('d-none')
            ;

        })
    ;

    sendingRequest = false;

    setTimeout(function(){ 
        $btnSubmit.prop('disabled',false)
            .find('.spinner-border')
            .addClass('d-none')
        ; 

    }, 1000);
    

}