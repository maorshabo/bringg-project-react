import locationParser from '../utils/parsers/locationParser';
import API from '../utils/API';

class TasksModel {
  constructor() {
    this.tasksList = [];
  }

  getAll() {
    return API.getTasks().then(tasks => tasks.map(TasksModel.taskParser)).then(tasks => this.tasksList = tasks);
  }

  static taskParser(task = {}) {
    if (task.location) {
      return Object.assign({}, task, { location: locationParser(task.location), isShown: true });
    }
    return task;
  }

  assignTask(taskId, driverId) {
    const taskIdx = this.tasksList.findIndex(t => t._id === taskId);
    this.tasksList[taskIdx].driverId = driverId;
    return this.tasksList;
  }

  toggleTaskShown(taskId) {
    if (taskId) {
      const taskIdx = this.tasksList.findIndex(t => t._id === taskId);
      this.tasksList[taskIdx].isShown = !this.tasksList[taskIdx].isShown;
    }
    return this.tasksList;
  }
}

export default TasksModel;