const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let scheduledTasksData = [];

// Load initial data
const loadInitialData = async () => {
  try {
    const { default: initialData } = await import('../mockData/scheduledTasks.json');
    scheduledTasksData = [...initialData];
  } catch (error) {
    console.warn('Could not load initial scheduled tasks data');
    scheduledTasksData = [];
  }
};

// Initialize data
loadInitialData();

const scheduledTaskService = {
  async getAll() {
    await delay(300);
    return [...scheduledTasksData];
  },

  async getById(id) {
    await delay(200);
    const task = scheduledTasksData.find(item => item.id === id);
    if (!task) {
      throw new Error('Scheduled task not found');
    }
    return { ...task };
  },

  async getByChildId(childId) {
    await delay(250);
    return scheduledTasksData.filter(task => task.childId === childId);
  },

  async create(taskData) {
    await delay(400);
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      status: taskData.status || 'pending'
    };
    scheduledTasksData.push(newTask);
    return { ...newTask };
  },

  async update(id, updatedData) {
    await delay(300);
    const index = scheduledTasksData.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Scheduled task not found');
    }
    scheduledTasksData[index] = { ...scheduledTasksData[index], ...updatedData };
    return { ...scheduledTasksData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = scheduledTasksData.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Scheduled task not found');
    }
    scheduledTasksData.splice(index, 1);
    return { success: true };
  }
};

export default scheduledTaskService;