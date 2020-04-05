
let regexGetHeaderURL = /(http){1}.*;{1}/;
let regexGetPort = /(65){1}[0-9]*/;


async function findData(projectName, listServer, optionDisplay, numberServer) {
  let fullData = [];
  for( i in listServer){
    await getPortOfProject(listServer[i], projectName)
      .then((allProject) => crawlData(allProject, projectName, listServer[i]))
      .then((fullyData) => fullData = fullData.concat(fullyData))
      .catch(data => { console.log('loi crawl data', data) });
  }
  return fullData;
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
  return new Promise((resolve, reject) => {
    let FullyData = [];
    let listAjax = [];
    for (const index in url) {
      if (url.hasOwnProperty(index)) {
        listAjax.push(callAjax(url[index], projectName, server));
      }
    }
    Promise.all(listAjax).then(data => {
      for (i in data) {
        if (data[i].length > 0) {
          resolve(data[i])
        }
      }
      reject();
    }).catch(() => { reject() });
  });
}

function callAjax(url, projectName, server) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'GET',
      url: url,
      success: async function (resp) {
        let FullyData = [];
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
            // saveDataProfilerToIndexDB($(profiler[i]).children());
          }
          resolve(FullyData);
        } else {
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




