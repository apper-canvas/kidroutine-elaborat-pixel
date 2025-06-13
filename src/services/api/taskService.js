const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasksData = [];

// Load initial data
const loadInitialData = async () => {
  try {
    const { default: initialData } = await import('../mockData/tasks.json');
    tasksData = [...initialData];
  } catch (error) {
    console.warn('Could not load initial tasks data');
    tasksData = [];
  }
};

// Initialize data
loadInitialData();

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasksData];
  },

  async getById(id) {
    await delay(200);
    const task = tasksData.find(item => item.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

  async create(taskData) {
    await delay(400);
    const newTask = {
      ...taskData,
      id: Date.now().toString()
    };
    tasksData.push(newTask);
    return { ...newTask };
  },

  async update(id, updatedData) {
    await delay(300);
    const index = tasksData.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    tasksData[index] = { ...tasksData[index], ...updatedData };
    return { ...tasksData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = tasksData.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    tasksData.splice(index, 1);
    return { success: true };
  }
};

export default taskService;