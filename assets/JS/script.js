const API_URL = "http://localhost:3000/users";
let modal = new bootstrap.Modal(document.getElementById('userModal'));
let viewModal = new bootstrap.Modal(document.getElementById('viewModal'));
let deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
let deleteId = null;

window.onload = getUsers;

// GET USERS
function getUsers() {
  const req = new XMLHttpRequest();
  req.open("GET", API_URL, true);

  req.onload = function () {
    if (req.status === 200) {
      const users = JSON.parse(req.responseText);
      displayUsers(users);
    }
  };

  req.send();
}

// DISPLAY USERS
function displayUsers(users) {
  let rows = "";

  users.forEach((user, index) => {
    rows += `
      <tr>
        <td>${index + 1}</td>
        <td>${user.name}</td>
        <td>${user.age}</td>
        <td>
        <div class="d-flex justify-content-center gap-1 flex-nowrap">
          <button class="btn btn-info btn-sm" onclick="viewUser('${user.id}', '${user.name}', '${user.age}')"><i class="bi bi-eye"></i><span class="d-none d-sm-inline"> View</span></button>
          <button class="btn btn-warning btn-sm" onclick="editUser('${user.id}','${user.name}','${user.age}')"><i class="bi bi-pencil-square"></i><span class="d-none d-sm-inline"> Edit</span></button>
          <button class="btn btn-danger btn-sm" onclick="deleteUser('${user.id}')"><i class="bi bi-trash"></i><span class="d-none d-sm-inline"> Delete</span></button>
        </div>
          </td>
      </tr>
    `;
  });

  document.getElementById("userTable").innerHTML = rows;
}

// VIEW USER
function viewUser(id, name, age) {
  document.getElementById("viewId").innerText = id;
  document.getElementById("viewName").innerText = name;
  document.getElementById("viewAge").innerText = age;
  viewModal.show();
}

// OPEN MODAL
function openAddModal() {
  clearForm();
  modal.show();
}

// SAVE USER (CREATE + UPDATE)
function saveUser() {
  const form = document.getElementById("userForm");

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const id = document.getElementById("userId").value;
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;


  const req = new XMLHttpRequest();
  const userData = JSON.stringify({ name, age });

  if (id) {
    req.open("PUT", `${API_URL}/${id}`, true);
  } 
  else {
    req.open("POST", API_URL, true);
  }

  req.setRequestHeader("Content-Type", "application/json");

  req.onload = function () {
    if (req.status === 200 || req.status === 201) {
      getUsers();
      modal.hide();
    }
  };

  req.send(userData);
}

// EDIT USER
function editUser(id, name, age) {
  document.getElementById("userId").value = id;
  document.getElementById("name").value = name;
  document.getElementById("age").value = age;
  document.querySelector("#userModal .modal-title").textContent = "Edit Student";
  modal.show();
}

// DELETE USER 
function deleteUser(id) {
  deleteId = id
  deleteModal.show();
}
// CONFIRM DELETE USER
function confirmDelete() {
  const req = new XMLHttpRequest();
  req.open("DELETE", `${API_URL}/${deleteId}`, true);

  req.onload = function () {
    if (req.status === 200) {
      getUsers();
      deleteModal.hide(); // close modal
    }
  };

  req.send();
}
// CLEAR FORM
function clearForm() {
  document.getElementById("userId").value = "";
  document.getElementById("name").value = "";
  document.getElementById("age").value = "";
  document.querySelector("#userModal .modal-title").textContent = "Add Student";
}