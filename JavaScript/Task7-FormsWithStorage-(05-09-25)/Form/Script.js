function getCookie(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

$(document).ready(function () {
    // check page load
    if (!getCookie("username")) {
        window.location.href = "../login/login.html";
    }

    // Session expiry
    let interval = setInterval(function () {
        if (!getCookie("username")) {
            clearInterval(interval);
            alert("Session expired! Please login again.");
            window.location.href = "../login/login.html";
        }
    }, 2000);

    // Load table with DataTables
    function loadTable() {
        let data = JSON.parse(localStorage.getItem("formData")) || [];
        let rows = "";
        data.forEach((item, index) => {
            rows += `
        <tr>
          <td>${item.name}</td>
          <td>${item.email}</td>
          <td>${item.phone}</td>
          <td>${item.address}</td>
          <td>${item.dept}</td>
          <td>${item.role}</td>
          <td>
            <button class="bg-blue-500 text-white px-2 rounded editBtn" data-index="${index}">Edit</button>
            <button class="bg-red-500 text-white rounded deleteBtn" data-index="${index}">Delete</button>
          </td>
        </tr>
      `;
        });

        //remove previous data
        if ($.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').DataTable().clear().destroy();
        }

        $("#dataTable tbody").html(rows);

        $('#dataTable').DataTable();
    }

    loadTable();

    //save form
    $("#detailsForm").submit(function (e) {
        e.preventDefault();
        let data = JSON.parse(localStorage.getItem("formData")) || [];
        let index = $("#editIndex").val();

        let record = {
            name: $("#name").val(),
            email: $("#email").val(),
            phone: $("#phone").val(),
            address: $("#address").val(),
            dept: $("#dept").val(),
            role: $("#role").val()
        };

        if (index) {
            data[index] = record;
            $("#editIndex").val("");
        } else {
            data.push(record);
        }

        localStorage.setItem("formData", JSON.stringify(data));
        this.reset();
        loadTable();
    });

    //update form
    $(document).on("click", ".editBtn", function () {
        let index = $(this).data("index");
        let data = JSON.parse(localStorage.getItem("formData")) || [];
        let record = data[index];

        $("#editIndex").val(index);
        $("#name").val(record.name);
        $("#email").val(record.email);
        $("#phone").val(record.phone);
        $("#address").val(record.address);
        $("#dept").val(record.dept);
        $("#role").val(record.role);

        //automatically scroll to top
        $('html, body').animate({
            scrollTop: $("#detailsForm").offset().top - 20
        }, 500);
    });


    //delete form
    $(document).on("click", ".deleteBtn", function () {
        let index = $(this).data("index");
        let data = JSON.parse(localStorage.getItem("formData")) || [];
        data.splice(index, 1);
        localStorage.setItem("formData", JSON.stringify(data));
        loadTable(); // update table
    });
});
