const apiUrl = 'https://your-api-name.onrender.com'

function sortData(data) {
  let htmlArray = [];

  data.forEach(task => {

    let id = task.id;
    let title = task.title;
    let description = task.description;
    let status = task.status;
    let creation_date = task.creation_date;
    let due_date = task.due_date;
    let last_modified_date = task.last_modified_date;

    if (status == 'Complete') {
      var circle = 'complete-circle'
    }
    else if (status == 'In-Progress') {
      var circle = 'empty-circle'
    }

    var task_html =
      `<div id="task-${id}" class="row g-0 border rounded-3 my-1" style="min-width: 510px;">

          <div class="col-1 position-relative">
            <button id="${id}" name="btn-${id}"
              class="position-absolute top-50 start-50 translate-middle ${circle}"
              onclick="updateStatus('${id}')"></button>
          </div>
          <div class="col-6 ps-1 align-self-center">
            <p id="task-title-${id}" class="my-2" style="font-size: 15px;">${title}</p>
          </div>
          <div class="col-2 align-self-center">
            <p class="text-end my-2" style="font-size: 15px;">Due Date:
            </p>
          </div>
          <div class="col-2 align-self-center">
            <p id="due-date-${id}" class="text-center my-2" style="font-size: 15px;">${due_date}</p>
          </div>
          <div class="col-1 align-self-center text-center ms-auto">
            <button id="info-${id}" name="info-btn-${id}" type="button"
              class="info-btn my-2" data-bs-toggle="collapse"
              data-bs-target="#collapse-${id}" aria-expanded="false" aria-controls="collapse-${id}"></button>
          </div>

          <div class="collapse" id="collapse-${id}">
            <div id="collapse-body-${id}" class="card-body">

              <p class="my-0">
                Description:
              </p>
              <p id="description-value-${id}" class="my-0">
                ${description}
              </p>
              <div class="row justify-content-end">
                <div class="col-2 text-end">
                  <button class="edit-info-btn" onclick="editTask('${id}')">
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>`


    htmlArray.push(task_html);

  });

  return htmlArray;
}


// Retrieve Complete List
function getCompleteList() {

  $.ajax({

    url: `${apiUrl}/completedtasks`,
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      let task_html = sortData(data);
      document.getElementById("cmplt_list").innerHTML = task_html.join('');
    },
    error: function (request, error) {
      console.log("Request: " + JSON.stringify(request));
    }
  })

}

// Retrieve Progress List
function getProgressList() {

  $.ajax({

    url: `${apiUrl}/progresstasks`,
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      let task_html = sortData(data);
      document.getElementById("pgrs_list").innerHTML = task_html.join('');
    },
    error: function (request, error) {
      console.log("Request: " + JSON.stringify(request));
    }
  })

}


// Request input from the client to add task
function requestTaskInput() {

  var input_html =
    `<div class="px-4 bg-light-subtle border border-2 border-light my-2 rounded-4">
    <div class="row">
      <p class="mb-0 mrg-t">Title</p>
      <div class="col mxw-50">
        <input id="cl_title" type="text" class="form-control" name="Title" aria-describedby="addon-wrapping">
      </div>
      <p class="mb-0 mrg-t">Description</p>
      <div class=" mxw-75">
        <input id="cl_description" type="text" class="form-control" name="Description"
          aria-describedby="addon-wrapping">
      </div>
      <p class="mb-0 mrg-t">Due Date</p>
      <div class="col mxw-25">
        <input id="cl_dueDate" type="text" class="form-control" name="Due Date" aria-describedby="addon-wrapping">
      </div>
      <p></p>
      <div class="col pb-2 pe-10 d-flex justify-content-end">
        <button id="deleteInput" class="btn btn-light" onclick="deletePrompt()">Cancel</button>
        <button id="sendInput" class="btn btn-secondary" onclick="sendInputToData()">Add Task</button>
      </div>
    </div>
  </div>`

  document.getElementById('getTaskDetails').innerHTML = input_html

}

// Store data that is being entered by the client to the database
function sendInputToData() {

  const title = document.querySelector('#cl_title').value
  const description = document.querySelector('#cl_description').value
  const due_date = document.querySelector('#cl_dueDate').value

  $.ajax({

    url: `${apiUrl}/todo`,
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({ title: title, description: description, due_date: due_date }),
    success: function (data) {
      console.log('Data uploaded:' + data)
      document.getElementById('pgrs_list').innerHTML = ''
      document.getElementById('cmplt_list').innerHTML = ''
      getCompleteList()
      getProgressList()
    },
    error: function (request, error) {
      console.log("Request: " + JSON.stringify(request));
    }
  })

  var backToButton = `<button id="add_task" onclick="requestTaskInput()" class="btn btn-light">+</button>`
  document.getElementById('getTaskDetails').innerHTML = backToButton

}

//Deletes prompt section
function deletePrompt() {
  document.getElementById('getTaskDetails').innerHTML = '<button id="add_task" onclick="requestTaskInput()" class="btn btn-light">+</button>'
}


// Updates the status of task
function updateStatus(id) {

  let cls = document.getElementById(id).classList
  let cmplt_list = document.getElementById('cmplt_list').innerHTML
  let pgrs_list = document.getElementById('pgrs_list').innerHTML
  let task = document.getElementById(`task-${id}`)

  if (cls.contains('empty-circle')) {
    $.ajax({

      url: `${apiUrl}/statuscomplete`,
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({ id }),
      success: function (data) {
        cls.remove('empty-circle');
        cls.add('complete-circle');
        document.getElementById('pgrs_list').innerHTML = ''
        document.getElementById('cmplt_list').innerHTML = ''
        getCompleteList()
        getProgressList()
      },
      error: function (request, error) {
        console.log("Request: " + JSON.stringify(request));
      }
    });
  }

  if (cls.contains('complete-circle')) {
    $.ajax({

      url: `${apiUrl}/statusinprogress`,
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({ id }),
      success: function (data) {
        cls.remove('complete-circle');
        cls.add('empty-circle');
        document.getElementById('cmplt_list').innerHTML = ''
        document.getElementById('pgrs_list').innerHTML = ''
        getProgressList()
        getCompleteList()
      },
      error: function (request, error) {
        console.log("Request: " + JSON.stringify(request));
      }
    });

  }
}


//Asks for input to edit task
function editTask(id) {
  let collapse_body = document.getElementById(`collapse-body-${id}`)
  let description_value = document.getElementById(`description-value-${id}`).innerText
  let title_value = document.getElementById(`task-title-${id}`).innerText
  let due_date = document.getElementById(`due-date-${id}`).innerText

  let request_input =
    `<div class="px-4 bg-light-subtle border border-2 border-light my-2 rounded-4">
  <div class="row">
    <p class="mb-0 mrg-t">Title</p>
    <div class="col mxw-50">
      <input id="cl_title" type="text" class="form-control" name="Title" aria-describedby="addon-wrapping">
    </div>
    <p class="mb-0 mrg-t">Description</p>
    <div class=" mxw-75">
      <input id="cl_description" type="text" class="form-control" name="Description"
        aria-describedby="addon-wrapping">
    </div>
    <p class="mb-0 mrg-t">Due Date</p>
    <div class="col mxw-25">
      <input id="cl_dueDate" type="text" class="form-control" name="Due Date" aria-describedby="addon-wrapping">
    </div>
    <p></p>
    <div class="col pb-2 pe-10 d-flex justify-content-end">
      <button id="cancel-edit" class="btn btn-light" onclick="cancelEdit()">Cancel</button>
      <button id="update-task-id" class="btn btn-secondary" onclick="updateTask('${id}')">Update Task</button>
    </div>
  </div>
</div>`

  collapse_body.innerHTML = request_input
  document.querySelector('#cl_title').value = title_value
  document.querySelector('#cl_description').value = description_value
  document.querySelector('#cl_dueDate').value = due_date
}


// UPDATE TASK FROM INPUT
function updateTask(id) {
  let collapse_body = document.getElementById(`collapse-body-${id}`)
  let send_title = collapse_body.querySelector('#cl_title').value
  let send_description = collapse_body.querySelector('#cl_description').value
  let send_dueDate = collapse_body.querySelector('#cl_dueDate').value

  $.ajax({
    url: `${apiUrl}/update_task`,
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({ id: id, send_title: send_title, send_description: send_description, send_dueDate: send_dueDate }),
    success: function (data) {
      document.getElementById('pgrs_list').innerHTML = ''
      document.getElementById('cmplt_list').innerHTML = ''
      getCompleteList()
      getProgressList()
    },
    error: function (request, error) {
      console.log("Request: " + JSON.stringify(request));
    },
  })

}

function cancelEdit() {
  // need to do get my todos for this specific task so it does not update the html
  document.getElementById('pgrs_list').innerHTML = ''
  document.getElementById('cmplt_list').innerHTML = ''
  getCompleteList()
  getProgressList()
}

document.addEventListener('DOMContentLoaded', function () {
  // getMyTodos()
  getCompleteList()
  getProgressList()
  console.log('Document finished loading');
})


