class GlobalConfig {
  constructor(){
      this.intervalTime;
      this.currentProject;
  }

  setIntervalTime(val) {
    this.intervalTime = val;
  }
  setCurrentProject(projectName, server){
    this.currentProject = {'projectName': projectName,
                            'server': server};
  }

  getInterval(){
    return this.intervalTime;
  }
  getCurrentProject(){
    return this.currentProject;
  }
}
