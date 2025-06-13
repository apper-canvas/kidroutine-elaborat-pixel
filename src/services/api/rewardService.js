const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let rewardsData = [];

// Load initial data
const loadInitialData = async () => {
  try {
    const { default: initialData } = await import('../mockData/rewards.json');
    rewardsData = [...initialData];
  } catch (error) {
    console.warn('Could not load initial rewards data');
    rewardsData = [];
  }
};

// Initialize data
loadInitialData();

const rewardService = {
  async getAll() {
    await delay(300);
    return [...rewardsData];
  },

  async getById(id) {
    await delay(200);
    const reward = rewardsData.find(item => item.id === id);
    if (!reward) {
      throw new Error('Reward not found');
    }
    return { ...reward };
  },

  async getByChildId(childId) {
    await delay(250);
    return rewardsData.filter(reward => reward.childId === childId);
  },

  async create(rewardData) {
    await delay(400);
    const newReward = {
      ...rewardData,
      id: Date.now().toString()
    };
    rewardsData.push(newReward);
    return { ...newReward };
  },

  async update(id, updatedData) {
    await delay(300);
    const index = rewardsData.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Reward not found');
    }
    rewardsData[index] = { ...rewardsData[index], ...updatedData };
    return { ...rewardsData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = rewardsData.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Reward not found');
    }
    rewardsData.splice(index, 1);
    return { success: true };
  }
};

export default rewardService;