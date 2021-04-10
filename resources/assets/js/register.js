import "core-js/stable";
import "regenerator-runtime/runtime";

import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle';
import '../../../public/dist/css/register.css';

import axios from 'axios';
import Inputmask from "inputmask";

var _errorList = {

    "GeneralError": "Lo sentimos, algo inesperado pasó, por favor recarga el sitio e intenta de nuevo.",
    "InternalServerError": "Lo sentimos, algo inesperado pasó, por favor recarga el sitio e intenta de nuevo.",
    "BadRequest": "Lo sentimos, algo inesperado pasó, por favor recarga el sitio e intenta de nuevo.",
    'PageExpired':'Lo sentimos su sesión ha expirado, please reload site and try again.',
    'Forbidden':'Sorry your Session has expired, por favor recarga el sitio e intenta de nuevo.',
    'RequestTimeout': 'Esta acción toma mucho tiempo, por favor espera e intente nuevamente.',

    'name' : {
        'required': 'requerido',
        'invalid': 'Ingrese su nombre.'
    },
    'document' : {
        'required': 'requerido',
        'invalid': 'Ingrese su número de identificación.',
        'already_registered': 'Documento existente.'
    },
    'email' : {
        'required': 'requerido',
        'invalid': 'Ingrese un email valido.'
    },
    'country' : {
        'required': 'requerido',
        'invalid': 'Ingrese su pais de origen.'
    },
    'password' : {
        'required': 'requerido',
        'invalid': 'Ingrese una contraseña.'
    },
    'confirm-password' : {
        'required': 'requerido',
        'invalid': 'No coinciden las contraseñas.'
    }

};

$(document).ready(async function(){
    const $form = $('#register-form');
    const $btnSubmit = $('#btn-register-submit',$form);
    let $countryListSelect = $('#country');

    //Inputmask for document input
    var input = document.getElementById("document");
    var inputField= new Inputmask("9999999999");
    inputField.mask(input);

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

    // Get country list from an api
    const countryList = await getCountryList();
    let countryListOpt = countryList.data;
    
    //console.log(countryListOpt);

    for(const data in countryListOpt) {
        //console.log(countryListOpt[data].name);
        $countryListSelect.append(`<option value="${countryListOpt[data].alpha2Code}">${countryListOpt[data].name}</option>`);
    }
    
    //Send Data
    $btnSubmit.off().on('click',async function(e){
        e.preventDefault();
        //console.log('se enviaron los datos');
        const result = isValid($form);

        if(result) {
            try {

                await callServiceCreate('register-form');

            } catch (error) {

                console.log(error);

            }
            
        }

    });

});

const getCountryList = async () => {
    return axios.get('https://restcountries.eu/rest/v2/all');
};

const isValid = ($container, onChange = false) => {
    
    console.log('is-valid');
    cleanErrors($container);

    let rulesList = {};    

    var result = validateFormFields($container);
    console.log(result);
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

        console.log(typeInput);

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
                    console.log(value);
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
    
    let myForm = document.getElementById(formId);
    let formData = new FormData(myForm);

    axios.post('/s/service-create', 
        formData  
      )
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
    });
}