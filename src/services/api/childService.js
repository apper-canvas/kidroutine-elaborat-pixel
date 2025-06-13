const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let childrenData = [];

// Load initial data
const loadInitialData = async () => {
  try {
    const { default: initialData } = await import('../mockData/children.json');
    childrenData = [...initialData];
  } catch (error) {
    console.warn('Could not load initial children data');
    childrenData = [];
  }
};

// Initialize data
loadInitialData();

const childService = {
  async getAll() {
    await delay(300);
    return [...childrenData];
  },

  async getById(id) {
    await delay(200);
    const child = childrenData.find(item => item.id === id);
    if (!child) {
      throw new Error('Child not found');
    }
    return { ...child };
  },

  async create(childData) {
    await delay(400);
    const newChild = {
      ...childData,
      id: Date.now().toString(),
      points: childData.points || 0
    };
    childrenData.push(newChild);
    return { ...newChild };
  },

  async update(id, updatedData) {
    await delay(300);
    const index = childrenData.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Child not found');
    }
    childrenData[index] = { ...childrenData[index], ...updatedData };
    return { ...childrenData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = childrenData.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Child not found');
    }
    childrenData.splice(index, 1);
    return { success: true };
  }
};

export default childService;