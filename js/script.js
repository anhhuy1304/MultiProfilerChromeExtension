$(document).ready(function () {
  $('#data').dataTable();
});

let regexGetHeaderURL = /(http){1}.*;{1}/;
let regexGetPort = /(65){1}[0-9]*/;

function checkPort(url, projectName){
  return new Promise((resolve, reject)=>{
    $.ajax({
      type: 'GET',
      url: url,
      success: function (resp) {
        let html = $(resp);
        let allTd = html.find("tbody tr td");
        if($(allTd[0]).text()==projectName){
          let urlWithPort = $(allTd[2]).children().first().attr('href');
          let port = regexGetPort.exec(urlWithPort);
          resolve(port)
        }
        else{
          reject(65000);
        }
      },
      error: function (data) {
      }
    });
  });
}

function getPortOfProject(server, projectName){
let port=65000;
return new Promise((resolve, reject) => {
  $.ajax({
    type: 'GET',
    url: 'http://'+server + ':65000/sc',
    success: function (resp) {
      let html = $(resp);
      let allTr = html.find("tbody tr");
      for(i = 0 ; i < allTr.length; i++){
        let domain  = regexGetHeaderURL.exec(allTr[i].innerHTML);
        checkPort(domain[0], projectName).then(data => {port = data[0];resolve(port)}).catch(data => {});
      }
    },
    error: function (data) {
        console.log("error", data);
        reject(65000);
    }
  });
});
}

function crawlData(url,server){
  $.ajax({
    type: 'GET',
    url: url,
    success: function (resp) {
      let html = $(resp);
      let table = $('#data').dataTable();
      tbody = html.find("tbody");
      let profiler = $(tbody[0]).find('tr');
      for(i = 0 ; i < profiler.length ; i++){
        $(profiler[i]).children().first().text(server)
        table.fnAddData( [
          $($(profiler[i]).children()[0]).text(),
          $($(profiler[i]).children()[1]).text(),
          $($(profiler[i]).children()[2]).text(),
          $($(profiler[i]).children()[3]).text(),
          $($(profiler[i]).children()[4]).text(),
          $($(profiler[i]).children()[5]).text(),
          $($(profiler[i]).children()[6]).text(),
          $($(profiler[i]).children()[7]).text()  
        ]);
      }
      console.log($(profiler[0]).children()[0])
    },
    error: function (data) {
      console.log("error", data);
    }
  });
}

$("#createProject").click(()=>{
  let projectName = $("#projectName").val();
  let hosts = $("#hosts").val();

  hosts.replace(/ /g,'');
  let listHost = hosts.split(';');
  saveToStorage(projectName, listHost);
})

$("#search").click(()=>{
  let table = $('#data').dataTable();
  table.fnClearTable();
  let projectName = $("#search-field").val();
  let data = localStorage.getItem(projectName);
  data.replace(/ /g,'');
  let listServer = data.split(',')
  listServer.forEach(server=>{
    getPortOfProject(server,projectName).then(port => {crawlData('http://'+server+":"+port+"/st", server);});
  })

})

function saveToStorage(projectName, listHost){
  localStorage.setItem(projectName, listHost);
}

