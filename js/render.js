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
          (Math.round(dataSum[index].totalReq / numberServer*100) / 100).toLocaleString(),
          (Math.round(dataSum[index].pendingReq / numberServer*100) / 100).toLocaleString(),
          (Math.round(dataSum[index].TotalTimeProc / numberServer*100) / 100).toLocaleString(),
          (Math.round(dataSum[index].LastTmProc / numberServer*100) / 100).toLocaleString(),
          (Math.round(dataSum[index].ProcRate / numberServer*100) / 100).toLocaleString(),
          (Math.round(dataSum[index].ReqRate / numberServer*100) / 100).toLocaleString(),
        ]);
      }
    });
  } else if (optionDisplay == 1) { //sum
    sumDataByProject(fullyData).then(dataSum=>{
      for (let index in dataSum) {
        console.log(dataSum)
        table.fnAddData([
          dataSum[index].server,
          dataSum[index].nameProject,
          (Math.round(dataSum[index].totalReq *100) /100).toLocaleString(),
          (Math.round(dataSum[index].pendingReq *100) / 100).toLocaleString(),
          (Math.round(dataSum[index].TotalTimeProc *100) / 100).toLocaleString(),
          (Math.round(dataSum[index].LastTmProc *100) / 100).toLocaleString(),
          (Math.round(dataSum[index].ProcRate *100) / 100).toLocaleString(),
          (Math.round(dataSum[index].ReqRate *100) / 100).toLocaleString(),
        ]);}
    })
  } else {//each
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