import "core-js/stable";
import "regenerator-runtime/runtime";

import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap/dist/css/bootstrap.css';

import axios from 'axios';
import _ from 'lodash';

import Handlebars from 'handlebars/dist/handlebars';

//datatable
import 'datatables.net-bs4';
import 'datatables.net-responsive-bs4';

$(document).ready(async function(){
    
    let contactList = {};
    
    //const $inputSearch = $('#txt-search-contact');
    const $inputCurrentId = $('#current-id');
    //const $btnSearch = $("#btn-search-contact");
    const $modalSearchResult = $("#modal-result-search");
    const $modalContactList = $("#modal-loading-contact-list");
    const $dataTableContact = $('#table_contact');
    
    // get all contacts from the api
    if($dataTableContact.length > 0) {
        $dataTableContact.addClass('d-none');
        $modalContactList.modal('show');
        const contact = await getContactList();
        contactList = contact.data.objects;
        $modalContactList.modal('hide');
        
        console.log('contact list has been created');
    }
    

    // init and setup datatable
    const table = $dataTableContact
        .DataTable( {
            "data": contactList,
            "lengthMenu": [[5,10, 25, 50, -1], [5,10, 25, 50, "Todos"]],
            "columns": [
                {
                    "className":      '',
                    "orderable":      false,
                    "data":           null,
                    "defaultContent": "<a href='javascript:;' class='details-user'><i class='far fa-eye'></i></a>"
                },
                { "data": "id" },
                { "data": "first_name" },
                { "data": "last_name" },
                { "data": "email" },
                { "data": "document" },
                { "data": "job_title" },
                { "data": "country" }
            ],
            "pagingType": "simple_numbers",
            "language": {
                "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
            },
            "responsive": true
        } )
    ;

    $dataTableContact.removeClass('d-none');

    // Saving result of the search 
    table.on('search.dt', async function(){
        
        const valueFilter = table.search();
        let inputCurrentId = $inputCurrentId.val();

        let metadata = '';

        console.log(valueFilter);

        const userDocumentFound =  
            _.findKey(
                contactList, 
                function(contact) { 
                    return contact.document == valueFilter.charAt(0).toUpperCase() + valueFilter.slice(1); 
                }
            )
        ;
        const userNameFound =  
            _.findKey(
                contactList, 
                function(contact) { 
                    return contact.first_name == valueFilter.charAt(0).toUpperCase() + valueFilter.slice(1); 
                }
            )
        ;
        const userEmailFound = 
            _.findKey(
                contactList, 
                function(contact) { 
                    return contact.email == valueFilter; 
                }
            )
        ;

        // validating result of the search
        if(contactList[userDocumentFound]){

            metadata = JSON.stringify(contactList[userDocumentFound]);
            await callServiceSaveRequest(inputCurrentId,metadata);

        } else if(contactList[userNameFound]) {
            
            metadata = JSON.stringify(contactList[userNameFound]);
            await callServiceSaveRequest(inputCurrentId,metadata);
            
        } else if(contactList[userEmailFound]) {
            
            metadata = JSON.stringify(contactList[userEmailFound]);
            await callServiceSaveRequest(inputCurrentId,metadata);
        
        }

    });

    $dataTableContact.find('tbody').on('click', 'a.details-user',function(){
        
        const tr = $(this).closest('tr');
        const row = table.row( tr );
        
        const source = document.getElementById("result-request").innerHTML;
        const template = Handlebars.compile(source);
        const html = template(row.data());
    
        $modalSearchResult.find('.modal-body').empty().append(html);
        $modalSearchResult.modal('show');
    
    });
   
});

const getContactList = async () => {
    return axios.get('http://www.mocky.io/v2/5d9f39263000005d005246ae?mocky-delay=1s');
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

