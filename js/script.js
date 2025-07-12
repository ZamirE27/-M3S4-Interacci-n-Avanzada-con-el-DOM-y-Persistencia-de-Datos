import {deletes, post, put} from './services.js';

// We start by defining the URL of the database
const urlDb = "http://localhost:3000/users"
const content = document.getElementById('content');

// This is the Single Page Application (SPA) router
function loadView(name, callback) {
    if (!name) {
        content.innerHTML = "";
        return;
    }
    // We fetch the HTML file corresponding to the view
    // The name parameter is the name of the view (e.g., "users", "post etc.")
    fetch(`views/${name}.html`)
        .then((res) => {
            if (!res.ok) throw new Error("Page could not be loaded");
            return res.text();
            })
            .then((html) => {
            content.innerHTML = html;

            if (name === "users") {
                loadUsers();
            } else if (name === "post") {
                createUser();
            }

            // Execute callback (like editUser)
            if (typeof callback === "function") {
                callback();
            }
        })
        .catch((err) => {
        content.innerHTML = "<p>Page could not be loaded</p>";
    });
}






// This is a "GET" function
// It will be used to fetch data from the server
function loadUsers() {
    fetch(urlDb) 
    .then(res => {
        if (!res.ok) throw new Error("JSON could not be loaded");
        return res.json();
    })
    .then(data => {
        showTable(data);
    })
    .catch(err => {
        console.error(err)
        const table = document.getElementById("users-table");
        table.insertAdjacentHTML("afterend", "<p>Error Loading Users</p>");
    });
}


function showTable(users) {
    const thead = document.querySelector("#users-table thead tr");
    const tbody = document.querySelector("#users-table tbody");

    // Event delegation for delete buttons
    document.querySelector("#users-table tbody").addEventListener("click", async (e) => {
        if (e.target.closest(".delete-btn")) {
            const btn = e.target.closest(".delete-btn");
            const id = btn.id;

            const confirmDelete = confirm("Are you sure you want to delete this user?");
            if (!confirmDelete) return;

            const deleteUser = await deletes(urlDb, id);
            if (deleteUser) {
                alert("The user was successfully deleted");
                // reload the users table
                loadUsers();
            }
        }
    });

    // Clear the existing table content
    thead.innerHTML = '';
    tbody.innerHTML = '';

    const columns = Object.keys(users[0]).filter(col => col !== "id");

    const headers = {
        name: "Name",
        email: "Email",
        phone: "Phone",
        enroll_number: "Enroll Number",
        date_of_admission: "Date of admission"
    }

    // Create thead
    columns.forEach(col => {
        const th = document.createElement("th");
        th.textContent = headers[col]; 
        thead.appendChild(th);
    });

  // create rows for each user
    users.forEach(user => {
        const tr = document.createElement("tr");
        tr.className="bodyTable"



        columns.forEach(col => {
            const td = document.createElement("td");
            td.textContent = user[col];
            tr.appendChild(td);
            
        });

        const btnCell = document.createElement("td");

        // Create the button with SVG icons
        // This button will be used to edit or delete the user
        const button = document.createElement("nav");
        button.className = "table-icons";
        button.innerHTML =`
            <a href="#/edit/${user.id}" data-link class="edit-btn" id="${user.id}">     
                <svg class="editBtn" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M3 21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm2-2.92 9.06-9.06.92.92L5.92 19H5zM18.37 3.29a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41z"></path>
                </svg>
            </a href="" data-link class="edit-btn" id="${user.id}");">
            <button class="delete-btn" id="${user.id}">    
                <svg trashBtn" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM8 9h8v10H8zm7.5-5-1-1h-5l-1 1H5v2h14V4z"></path>
                </svg>
            </button>
        `;

        // Insert the button into the cell
        btnCell.appendChild(button);

        // Insert the button cell into the row
        tr.appendChild(btnCell);

        // insert the row into the tbody
        tbody.appendChild(tr);
    });
}

// Funtion to handle navigation based on the hash in the URL
// This function will be called when the hash changes or when the page loads
function router() {
    const hash = window.location.hash || "#/";
    const route = hash.slice(2); // "edit/5"

    if (route.startsWith("edit/")) {
        const id = route.split("/")[1];
        loadView("edit", () => {
        editUser(id); // ejecutar la función una vez cargado el HTML
        });
    } else {
        loadView(route);
    }
}
window.addEventListener('hashchange', router);
// this will load the initial view when the page loads
// If you want to load a specific view on page load, you can set the hash in the URL
window.addEventListener('load', router);



// Create User Function
// This function will be called when the user navigates to the "post" view
// It will handle the form submission to create a new user
function createUser() {
    let form = document.getElementById("create-user");
    const cancel = document.getElementById("cancelBtn");

    if (!form) {
        console.error("Form not found");
        return;
    }

    if (cancel) {
        cancel.addEventListener("click", () => {
            form.reset();          
            window.location.hash = "#/users";  // volver a la tabla
        });
    }


    form.addEventListener("submit", async (event)=>{
        event.preventDefault()
        let name = document.getElementById("name").value
        let email = document.getElementById("email").value
        let phone = document.getElementById("phone").value
        let enrollNumber = document.getElementById("enrollNumber").value
        let dateOfAdmission = document.getElementById("dateOfAdmission").value
        let user = {
            name: name,
            email: email,
            phone: phone,
            enroll_number: enrollNumber,
            date_of_admission: dateOfAdmission
        }

        let newUser = await post(urlDb, user)
        if (newUser){
            alert("The user was sucessffully created")
        }else{
            alert("The user was not sucessffully created")
        }
    })
}

function editUser(id) {
    const form = document.getElementById("edit-user");

  // 1. Load Currently data
    fetch(`http://localhost:3000/users/${id}`)
    .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
    })
    .then((user) => {
        // Show the data in the forms
        document.getElementById("name").value = user.name;
        document.getElementById("email").value = user.email;
        document.getElementById("phone").value = user.phone;
        document.getElementById("enrollNumber").value = user.enroll_number;
        document.getElementById("dateOfAdmission").value = user.date_of_admission;

        
        form.onsubmit = async function (event) {
        event.preventDefault();

        const updatedUser = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            enroll_number: document.getElementById("enrollNumber").value,
            date_of_admission: document.getElementById("dateOfAdmission").value,
            };

            try {
                const updated = await put(urlDb, id, updatedUser);
                window.location.hash = "#/users"; // Redirect the users
            } catch (err) {
                alert("Error updating user");
            }
        };
    });

  // 3. Cancel
    const cancel = document.getElementById("cancelBtn");
    cancel.addEventListener("click", () => {
        window.location.hash = "#/users";
    });
}