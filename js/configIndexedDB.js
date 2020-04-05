
class ConfigIndexedDB{
  constructor() {
    this.configDB = new WrapperIndexedDB("config_db");
    this.configDB.open(
      openConfigDBSuccess, openConfigDBError, openConfigDBUpgradeNeeded, 'value', 'config', null
    );
  }

  async getConfigInterval(){
    let interval = 2;
    await this.configDB.read('interval').then(
      data => {
        if(data != undefined)
              { 
                interval = data;
              }},
      error => {console.log('error')}
    );
    return interval;
  }
  
  setConfigInterval(val){
    let data = {
      config: 'interval',
      value: val,
    };
    this.configDB.add(data).then(
      event => console.log('add success interval', event),
      error => console.log('add error interval ', error)
    );
  }

  async getConfigCurrentProject(){
    let currentProject;
    await this.configDB.read('currentProject').then(
      data => {currentProject = data},
      error => {return null}
    );
    return currentProject;
  }
  
  setConfigCurrentProject(projectName, server){
    let currentProject = {
    'projectName': projectName,
    'server': server};
    let data = {
      config: 'currentProject',
      value: currentProject,
    };
    this.configDB.put(data).then(
      event => console.log('add success interval', event),
      error => console.log('add error interval ', error)
    );
  }
}

async function openConfigDBSuccess() {
  console.log('open and init done config')
  let interval;
  await configIndexedDB.getConfigInterval().then(data => interval = data);
  let currentProject;
  await configIndexedDB.getConfigCurrentProject().then(data => currentProject = data);
  await globalConfig.setIntervalTime(interval);
  await globalConfig.setCurrentProject(currentProject.value.projectName, currentProject.value.server);
  initRefresh();
  let $select = $("#intput-project-search").selectize();
  let selectize = $select[0].selectize;
  selectize.setValue(currentProject.value.projectName);
};
function openConfigDBError() {
  console.log('open db error');
}
function openConfigDBUpgradeNeeded() {
  console.log('open db upgradedneeded');
}
