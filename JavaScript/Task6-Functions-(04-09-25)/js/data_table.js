$(document).ready(function () {
    function dataTable() {
        $("#employee-data").DataTable({
            data: [],
            columns: [
                { title: "Employee Id", data: "emp_id" },
                { title: "Employee Name", data: "emp_Name" },
                { title: "Email", data: "email" },
                { title: "Phone", data: "phone" },
                { title: "Department", data: "department" },
                { title: "Position", data: "position" },
                { title: "Task Role", data: "task_role" },
                { title: "Gender", data: "gender" },
                { title: "Address", data: "address" },
                { title: "Action", data: "action" },
                { title: "Task Name", data: "taskdetails" },
                { title: "Due Date", data: "due_date" },
                { title: "Priority", data: "priority" },
                { title: "Comments", data: "comments" },

            ]
        });

        loadDataTable();
    }

    function loadDataTable() {
        try {

            const employees = JSON.parse(localStorage.getItem("employees")) || [];
            const table = $("#employee-data").DataTable();
            table.clear().rows.add(employees).draw();
        }
        catch (err) {
            console.log(err)
        }
    }
    dataTable()

    function employeeTaskStatusChart() {
        try {
            const employees = JSON.parse(localStorage.getItem("employees")) || [];

            let status = {};

            employees.forEach(val => {
                if (isNaN(status[val.status])) {
                    status[val.status] = 0;

                }
                else
                    status[val.status] = status[val.status] + 1;

            });

            const statusValues = Object.values(status);
            const statusKeys = Object.keys(status);
            if (statusValues.length > 0) {
                $("#chartContainer").show();

                let taskStatus = document.getElementById("taskChart").getContext("2d");
                window.skillsChartInstance = new Chart(taskStatus, {
                    type: "pie",
                    data: {
                        labels: statusKeys,
                        datasets: [{
                            data: statusValues,
                            backgroundColor: [
                                "#3B82F6", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6"
                            ]
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: "bottom"
                            },
                            title: {
                                display: true,
                                text: "Task Status"
                            }
                        }
                    }
                });
            } else {
                $("#chartContainer").hide();
            }
        } catch (err) {
            console.log(err)
        }
    }
    employeeTaskStatusChart()




})
