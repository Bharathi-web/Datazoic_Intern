
$(document).ready(function () {
$.getJSON('Jsonfile.json', function (json) {
    const data = json.data;

    const $form = $('#dynamicForm');


    data.forEach(field => {
        if (!field.enable) return;

        let fieldHtml = `<div class="flex items-center p-2">
                    <label for="${field.id}" 
                    class="w-1/3 font-medium text-lg text-black">${field.title}${field.mandatory ? '<span class="text-red-500"> *</span>' : ''}</label>`;

        switch (field.inputType) {

            case 'text':
                if (field.id === 'ename') {
                    fieldHtml += `<input type="text" id="${field.id}" name="${field.id}" 
                            class="w-2/3 p-2 border bg-white rounded-md focus:ring focus:ring-blue-300" maxlength="${field.charLength}" 
                            pattern="^[A-Za-z ]+$" title="Only alphabets allowed" ${field.mandatory ? 'required' : ''}>`;
                } else {
                    fieldHtml += `<input type="text" id="${field.id}" name="${field.id}" 
                            class="w-2/3 p-2 border bg-white rounded-md focus:ring focus:ring-blue-300" ${field.charLength ? `maxlength="${field.charLength}"` : ''} ${field.mandatory ? 'required' : ''}>`;
                }
                break;


            case 'number':
                if (field.id === 'phno') {
                    fieldHtml += `<input type="tel" id="${field.id}" name="${field.id}" 
                            class="w-2/3 p-2 border bg-white rounded-md focus:ring focus:ring-blue-300" 
                            pattern="\\d{10}" maxlength="10" title="Enter a 10-digit phone number" ${field.mandatory ? 'required' : ''}>`;
                } else {
                    fieldHtml += `<input type="number" id="${field.id}" name="${field.id}" 
                            class="w-2/3 p-2 border bg-white rounded-md focus:ring focus:ring-blue-300" ${field.mandatory ? 'required' : ''}>`;
                }
                break;


            case 'textarea':
                fieldHtml += `<textarea id="${field.id}" name="${field.id}" 
                        class="w-2/3 p-2 border rounded-md bg-white focus:ring focus:ring-blue-300" ${field.mandatory ? 'required' : ''}></textarea>`;
                break;

            case 'email':
                fieldHtml += `<input type="${field.inputType}" id="${field.id}" name="${field.id}" 
                        class="w-2/3 p-2 border rounded-md bg-white focus:ring focus:ring-blue-300" ${field.mandatory ? 'required' : ''}>`;
                break;

            case 'select':
                fieldHtml += `<select id="${field.id}" name="${field.id}" 
                        class="w-2/3 p-2 border rounded-md bg-white focus:ring focus:ring-blue-300" ${field.mandatory ? 'required' : ''}>`;
                field.options.forEach(opt => {
                    fieldHtml += `<option value="${opt.value}">${opt.text}</option>`;
                });
                fieldHtml += `</select>`;
                break;

            case 'checkbox':
                fieldHtml += `<div class="w-2/3 flex flex-col">`;
                field.options.forEach(opt => {
                    fieldHtml += `<label class="flex items-center space-x-2">
                    <input type="checkbox" name="${field.id}" value="${opt.value}" class="form-checkbox text-blue-600">
                    <span>${opt.text}</span>
                </label>`;
                });
                fieldHtml += `</div>`;
                break;
        }

        fieldHtml += `</div>`;
        $form.append(fieldHtml);
    });

    $form.append(`
            <div class="flex justify-center mt-6">
                <button type="submit" class="w-1/4 text-white border border-black bg-blue-600 rounded-lg shadow-md p-3 mt-4">
                    Register
                    </button></div>
                    `);



    $form.on('submit', function (e) {
        e.preventDefault();

        const phone = $('#phno').val();
        const name = $('#ename').val();

        const phoneValid = /^\d{10}$/.test(phone);
        const nameValid = /^[A-Za-z ]+$/.test(name);

        if (!phoneValid) {
            alert("Phone number must be exactly 10 digits.");
            return;
        }

        if (!nameValid) {
            alert("Name must contain only alphabets.");
            return;
        }

        const formData = $(this).serializeArray();
        console.log("Form submitted:", formData);

        window.location.href = "RenderForm/TodoList.html";
    });

});
});

