import "core-js/stable";
import "regenerator-runtime/runtime";

import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle';

import axios from 'axios';
import findKey from 'lodash/findKey';

const Handlebars = require('handlebars');

$(document).ready(async function(){
    
    let contactList = {};
    
    const $inputSearch = $('#txt-search-contact');
    const $inputCurrentId = $('#current-id');
    const $btnSearch = $("#btn-search-contact");
    const $modalSearchResult = $("#modal-result-search");
    
    // create localstorage for save all contact from the api
    if(!localStorage.getItem('contact-list')){
        const contact = await getContactList();
        localStorage.setItem('contact-list',JSON.stringify(contact.data.objects));
        contactList = localStorage.getItem('contact-list');
        console.log('creating localstorage');
    } else {
        contactList = JSON.parse(localStorage.getItem('contact-list'));
    }

    // Handling event click of the submit button
    $btnSearch.off().on('click',async function(e){
        
        const inputSearch = $inputSearch.val();
        const inputCurrentId = $inputCurrentId.val();
        let metadata = '';
        
        // variables for search contanct from localstorage object
        const userDocumentFound =  
            findKey(
                contactList, 
                function(contact) { 
                    return contact.document == inputSearch.charAt(0).toUpperCase() + inputSearch.slice(1); 
                }
            )
        ;
        const userNameFound =  
            findKey(
                contactList, 
                function(contact) { 
                    return contact.first_name == inputSearch.charAt(0).toUpperCase() + inputSearch.slice(1); 
                }
            )
        ;
        const userEmailFound = 
            findKey(
                contactList, 
                function(contact) { 
                    return contact.email == inputSearch; 
                }
            )
        ;
        
        // compiling handlebars 
        const source = document.getElementById("result-request").innerHTML;
        const template = Handlebars.compile(source);
        let html = '';
        
        // validating result of the search
        if(contactList[userDocumentFound]){

            metadata = JSON.stringify(contactList[userDocumentFound]);
            await callServiceSaveRequest(inputCurrentId,metadata);
           
            html = template(contactList[userDocumentFound]);

        } else if(contactList[userNameFound]) {
            
            metadata = JSON.stringify(contactList[userNameFound]);
            await callServiceSaveRequest(inputCurrentId,metadata);
           
            html = template(contactList[userNameFound]);

            
            
        } else if(contactList[userEmailFound]) {
            
            metadata = JSON.stringify(contactList[userEmailFound]);
            await callServiceSaveRequest(inputCurrentId,metadata);
            html = template(contactList[userEmailFound]);
            
        } else {
            html = `
                <div class="container">
                    <div class='row'>
                        <div class='col-12'>
                            <h1 class='text-center'>No hay resultado</h1>
                        </div>
                    </div>
                </div>
            `;
        }

        // launch popup
        $modalSearchResult.find('.modal-body').empty().append(html);
        $modalSearchResult.modal('show');

    });

   
});

const getContactList = async () => {
    return axios.get('http://www.mocky.io/v2/5d9f39263000005d005246ae?mocky-delay=10s');
};

const callServiceSaveRequest = async (userId,metadata) => {
    
    var formData = new FormData(); 
    formData.append('userId', userId);
    formData.append('metadata', metadata);

    axios.post('/s/service-save-request', 
            formData
        )
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            
            const errorData = error.response.data;
            
            console.log(errorData);

        })
    ;

}
