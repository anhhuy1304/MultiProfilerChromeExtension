$("#createProject").click(()=>{
  let projectName = $("#projectName").val();
  let hosts = $("#hosts").val();

  hosts.replace(/ /g,'');
  let listHost = hosts.split(';');
  saveToStorage(projectName, listHost);
})

$("#search").click(()=>{
  findData();
});

$("#search-field").on('keyup', function (e) {
  if (e.keyCode === 13) {
    findData();
  }
});