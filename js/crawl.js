$(document).ready(function () {
  initDB();
  findData();
  // window.setInterval(()=>{findData()}, 60000);
});

let regexGetHeaderURL = /(http){1}.*;{1}/;
let regexGetPort = /(65){1}[0-9]*/;

const INDEXED_DB_NAME = 'profiler_db';
let firstname, email, id;
let profilerIndexedDB;
let objName = 'profiler';
let keyPath = 'ts';
function initDB() {
  profilerIndexedDB = new ProfilerIndexedDB(INDEXED_DB_NAME);
  profilerIndexedDB.open(
    openDBSuccess, openDBError, openDBUpgradeNeeded, objName, keyPath, null
  );
}

function findData() {
  listServer = ['10.30.80.16'];
  projectName = "zadmin"
  listServer.forEach(server => {
    getPortOfProject(server, projectName).then((allProject) => crawlData(allProject, projectName, server));
  });

}


function getPortOfProject(server, projectName) {
  let port = 65000;
  let table = $('#data').dataTable();
  table.fnClearTable();
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'GET',
      url: 'http://' + server + ':65000/sc',
      success: function (resp) {
        let html = $(resp);
        let allTr = html.find("tbody tr iframe");
        let allProject = [];
        for (i = 0; i < allTr.length; i++) {
          let domain = allTr[i].src.replace(/bi.*/g, 'st');
          allProject.push(domain);
        }
        resolve(allProject, projectName, server);
      },
      error: function (data) {
        console.log("error", data);
        reject(65000);
      }
    });
  });
}

function crawlData(url, projectName, server) {
    for (const index in url) {
      if (url.hasOwnProperty(index)) {
        $.ajax({
          type: 'GET',
          url: url[index],
          success: function (resp) {
            let html = $(resp);
            curProjectName = html.find("h3")[0].innerHTML;
            if (projectName == curProjectName) {
              tbody = html.find("tbody");
              let profiler = $(tbody[0]).find('tr');
              let table = $('#data').dataTable();
              for (i = 0; i < profiler.length; i++) {
                $(profiler[i]).children().first().text(server)
                table.fnAddData([
                  $($(profiler[i]).children()[0]).text(), //server
                  $($(profiler[i]).children()[1]).text(), //nameProject
                  $($(profiler[i]).children()[2]).text(), //totalReq
                  $($(profiler[i]).children()[3]).text(), //pendingReq
                  $($(profiler[i]).children()[4]).text(), //TotalTimeProc
                  $($(profiler[i]).children()[5]).text(), //LastTmProc
                  $($(profiler[i]).children()[6]).text(), //ProcRate
                  $($(profiler[i]).children()[7]).text()  //ReqRate
                ]);
                saveDataProfilerToIndexDB($(profiler[i]).children());
              }
            }
          },
          error: function (data) {
            console.log("error", data);
          }
        });
      }
    }
}

function saveToStorage(projectName, listHost) {
  localStorage.setItem(projectName, listHost);
}


function openDBSuccess() {
  console.log('open db success');
}
function openDBError() {
  console.log('open db error');
}
function openDBUpgradeNeeded() {
  console.log('open db upgradedneeded');
}

function saveDataProfilerToIndexDB(dataCrawl){
  let data = {
    ts: new Date(),
    server: $(dataCrawl[0]).text(),
    nameProject: $(dataCrawl[1]).text(),
    totalReq:$(dataCrawl[2]).text(),
    pendingReq:$(dataCrawl[3]).text(),
    TotalTimeProc:$(dataCrawl[4]).text(),
    LastTmProc:$(dataCrawl[5]).text(),
    ProcRate:$(dataCrawl[6]).text(),
    ReqRate:$(dataCrawl[7]).text()
  };


  profilerIndexedDB.add(data).then(
    event => console.log('add success', event),
    error => console.log('add error', error)
  );
}