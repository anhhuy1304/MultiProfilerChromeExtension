class ViewerHandler{
  constructor(props) {
  }
  
  displayData(fullyData, optionDisplay, numberServer) {
  let table = $('#data').dataTable();
  if (optionDisplay == 2) {//avg
    sumDataByProject(fullyData).then(dataSum =>{
      console.log(dataSum)
      for (let index in dataSum) {
        table.fnAddData([
          dataSum[index].server,
          dataSum[index].nameProject,
          dataSum[index].totalReq / numberServer,
          dataSum[index].pendingReq / numberServer,
          dataSum[index].TotalTimeProc / numberServer,
          dataSum[index].LastTmProc / numberServer,
          dataSum[index].ProcRate / numberServer,
          dataSum[index].ReqRate / numberServer,
        ]);
      }
    });
  } else if (optionDisplay == 1) { //sum
    sumDataByProject(fullyData).then(dataSum=>{
      for (let index in dataSum) {
        table.fnAddData([
          dataSum[index].server,
          dataSum[index].nameProject,
          dataSum[index].totalReq,
          dataSum[index].pendingReq,
          dataSum[index].TotalTimeProc,
          dataSum[index].LastTmProc,
          dataSum[index].ProcRate,
          dataSum[index].ReqRate,
        ]);}
    })
  } else {//each
    console.log('oh man',fullyData)
    for (let index in fullyData) {
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
}


async function sumDataByProject(fullyData) {
  var result = await fullyData.reduce(function (acc, val) {
    var o = acc.filter(function (obj) {
      return obj.nameProject == val.nameProject;
    }).pop() || {
      server: '#',
      nameProject: val.nameProject,
      totalReq: 0,
      pendingReq: 0,
      TotalTimeProc: 0,
      LastTmProc: 0,
      ProcRate: 0,
      ReqRate: 0,
    };

    o.totalReq += Number(val.totalReq.replace(/,/g,''));
    o.pendingReq += Number(val.pendingReq.replace(/,/g,''));
    o.TotalTimeProc += Number(val.TotalTimeProc.replace(/,/g,''));
    o.LastTmProc += Number(val.LastTmProc.replace(/,/g,''));
    o.ProcRate += Number(val.ProcRate.replace(/,/g,''));
    o.ReqRate += Number(val.ReqRate.replace(/,/g,''));
    acc.push(o);
    return acc;
  }, []);
  result = await getUnique(result, 'nameProject')
  return result;
}

function getUnique(arr, comp) {
  const unique = arr
    .map(e => e[comp])
    .map((e, i, final) => final.indexOf(e) === i && i)
    .filter(e => arr[e]).map(e => arr[e]);
  return unique;
}