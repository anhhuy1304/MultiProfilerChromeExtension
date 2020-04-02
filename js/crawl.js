
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

function findData(projectName, listServer, optionDisplay, numberServer) {
  listServer.forEach(server => {
    getPortOfProject(server, projectName)
    .then((allProject) => crawlData(allProject, projectName, server))
    .then((fullyData) => displayData(fullyData, optionDisplay, numberServer))
    .catch(data =>{console.log('loi cmnr', data)});
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
  return new Promise( (resolve, reject) => {
    let FullyData = [];
    let listAjax = [];
    for (const index in url) {
      if (url.hasOwnProperty(index)) {
        listAjax.push(callAjax(url[index],projectName,server));
      }
    }
    Promise.all(listAjax).then(data => {
      for(i in data){
        if(data[i].length >0){
          resolve(data[i])
        }
      }
      reject();
    }).catch(() => {reject()});
  });
}

function saveToStorage(projectName, listHost) {
  localStorage.setItem(projectName, listHost);
}

function callAjax(url, projectName,server){
  return new Promise((resolve, reject)=>{
  $.ajax({
    type: 'GET',
    url: url,
    success: async function (resp) {
      let FullyData =[];
      let html = $(resp);
      curProjectName = html.find("h3")[0].innerHTML;
      if (projectName == curProjectName) {
        tbody = html.find("tbody");
        let profiler = $(tbody[0]).find('tr');
        for (i = 0; i < profiler.length; i++) {
          $(profiler[i]).children().first().text(server)
          FullyData.push({
            server: $($(profiler[i]).children()[0]).text(),
            nameProject: $($(profiler[i]).children()[1]).text(),
            totalReq: $($(profiler[i]).children()[2]).text(),
            pendingReq: $($(profiler[i]).children()[3]).text(),
            TotalTimeProc: $($(profiler[i]).children()[4]).text(),
            LastTmProc: $($(profiler[i]).children()[5]).text(),
            ProcRate: $($(profiler[i]).children()[6]).text(),
            ReqRate: $($(profiler[i]).children()[7]).text(),
          })
          saveDataProfilerToIndexDB($(profiler[i]).children());
        }
        resolve(FullyData);
      }else{
        resolve(FullyData);
      }
    },
    error: function (data) {
      resolve();
      console.log("error", data);
    }
  });
})
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



function displayData(fullyData, optionDisplay, numberServer){
  let table = $('#data').dataTable();
  if(optionDisplay == 2){//avg
    dataSum = sumDataByProject(fullyData);
    for(index in dataSum){
      table.fnAddData([
        dataSum[index].server,
        dataSum[index].nameProject,
        dataSum[index].totalReq/numberServer,
        dataSum[index].pendingReq/numberServer,
        dataSum[index].TotalTimeProc/numberServer,
        dataSum[index].LastTmProc/numberServer,
        dataSum[index].ProcRate/numberServer,
        dataSum[index].ReqRate/numberServer,
      ]);
    }
  }else if(optionDisplay ==1){ //sum
    dataSum = sumDataByProject(fullyData);
    dataSum = sumDataByProject(fullyData);
    for(index in dataSum){
      table.fnAddData([
        dataSum[index].server,
        dataSum[index].nameProject,
        dataSum[index].totalReq,
        dataSum[index].pendingReq,
        dataSum[index].TotalTimeProc,
        dataSum[index].LastTmProc,
        dataSum[index].ProcRate,
        dataSum[index].ReqRate,
      ]);
    }
  }else {//each
    console.log(fullyData.length)
    for(index in fullyData){
      console.log('inhear');
      table.fnAddData([
        fullyData[index].server,
        fullyData[index].nameProject,
        fullyData[index].totalReq,
        fullyData[index].pendingReq,
        fullyData[index].TotalTimeProc,
        fullyData[index].LastTmProc,
        fullyData[index].ProcRate,
        fullyData[index].ReqRate,
      ]);
    }

  }
}

function sumDataByProject(fullyData) {
  var result = fullyData.reduce(function (acc, val) {
    var o = acc.filter(function (obj) {
      return obj.nameProject == val.nameProject;
    }).pop() || {
        server: val.server,
        nameProject: val.nameProject,
        totalReq: 0,
        pendingReq: 0,
        TotalTimeProc: 0,
        LastTmProc: 0,
        ProcRate: 0,
        ReqRate: 0,
      };

    o.totalReq += val.totalReq;
    o.pendingReq += val.pendingReq;
    o.TotalTimeProc += val.TotalTimeProc;
    o.LastTmProc += val.LastTmProc;
    o.ProcRate += val.ProcRate;
    o.ReqRate += val.ReqRate;
    acc.push(o);
    return acc;
  }, []);
  result = getUnique(result, 'nameProject')
  return result;
}

function getUnique(arr, comp) {
  const unique = arr
    .map(e => e[comp])
    .map((e, i, final) => final.indexOf(e) === i && i)
    .filter(e => arr[e]).map(e => arr[e]);
  return unique;
}