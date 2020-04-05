class ProfilerIndexedDB {
  constructor() {
    this.historyDB = new WrapperIndexedDB("history_db");
  }

  async openDB(){
    await this.historyDB.open(
      openDBSuccess, openDBError, openDBUpgradeNeeded, 'profiler', 'ts', null
    );
  }
  saveDataProfilerToIndexDB(dataCrawl) {
    let data = {
      ts: new Date(),
      server: $(dataCrawl[0]).text(),
      nameProject: $(dataCrawl[1]).text(),
      totalReq: $(dataCrawl[2]).text(),
      pendingReq: $(dataCrawl[3]).text(),
      TotalTimeProc: $(dataCrawl[4]).text(),
      LastTmProc: $(dataCrawl[5]).text(),
      ProcRate: $(dataCrawl[6]).text(),
      ReqRate: $(dataCrawl[7]).text()
    };
    this.historyDB.add(data).then(
      event => console.log('add success', event),
      error => console.log('add error', error)
    );
  }
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
