let usersURL = "https://jsonplaceholder.typicode.com/users/10";

function showError(xhr, status, error) {
    const msg = `Error: ${status} | HTTP ${xhr.status}\n${error}\n\nResponseText:\n${xhr.responseText || '[no body]'}`;
    $("#info").text("Request failed — see details below.").addClass("text-red-600");
    $("#raw").text(msg).removeClass("hidden");
    $("#tableWrap").html("");
    console.error(msg);
}

// GET users
$("#getBtn").on("click", function () {
    $("#info").text("Loading users...").removeClass("text-red-600");
    $("#raw").addClass("hidden").text("");

$.ajax({
          url: usersURL,
          method: "GET",
          dataType: "json",
          success: function (data) {
            $("#info").text("Data loaded!");

           let table = `
          <table class="min-w-full divide-y divide-gray-200 border">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-3 py-2 border">ID</th>
                <th class="px-3 py-2 border">Name</th>
                <th class="px-3 py-2 border">Username</th>
                <th class="px-3 py-2 border">Email</th>
                <th class="px-3 py-2 border">City</th>
                <th class="px-3 py-2 border">Phone</th>
                <th class="px-3 py-2 border">Website</th>
                <th class="px-3 py-2 border">Company</th>
              </tr>
            </thead>
            <tbody>
        `;


            // Array → loop, Object → single row
            if (Array.isArray(data)) {
              data.forEach(u => {
                table += `<tr class="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
              <td class="px-3 py-2 border text-center">${u.id}</td>
              <td class="px-3 py-2 border">${u.name}</td>
              <td class="px-3 py-2 border">${u.username}</td>
              <td class="px-3 py-2 border">${u.email}</td>
              <td class="px-3 py-2 border">${u.address?.city || ''}</td>
              <td class="px-3 py-2 border">${u.phone}</td>
              <td class="px-3 py-2 border">${u.website}</td>
              <td class="px-3 py-2 border">${u.company?.name || ''}</td>
            </tr>
`;
              });
            } else {
              table += `<tr class="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
              <td class="px-3 py-2 border text-center">${data.id}</td>
              <td class="px-3 py-2 border">${data.name}</td>
              <td class="px-3 py-2 border">${data.username}</td>
              <td class="px-3 py-2 border">${data.email}</td>
              <td class="px-3 py-2 border">${data.address?.city || ''}</td>
              <td class="px-3 py-2 border">${data.phone}</td>
              <td class="px-3 py-2 border">${data.website}</td>
              <td class="px-3 py-2 border">${data.company?.name || ''}</td>
            </tr>`;
            }

            table += `</tbody></table>`;
            $("#tableWrap").html(table);
        },
        error: function (xhr, status, error) {
            showError(xhr, status, error);
        }
    });

});


