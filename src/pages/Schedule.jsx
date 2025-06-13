import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';
import { childService, scheduledTaskService, taskService } from '../services';
import { toast } from 'react-toastify';

const Schedule = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [scheduledTasks, setScheduledTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  // Time slots for the schedule
  const timeSlots = [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [childrenData, tasksData] = await Promise.all([
        childService.getAll(),
        taskService.getAll()
      ]);
      
      setChildren(childrenData);
      setTasks(tasksData);
      
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0]);
        await loadScheduledTasks(childrenData[0].id);
      }
    } catch (err) {
      setError(err.message || 'Failed to load schedule data');
      toast.error('Failed to load schedule data');
    } finally {
      setLoading(false);
    }
  };

  const loadScheduledTasks = async (childId) => {
    try {
      const scheduled = await scheduledTaskService.getByChildId(childId);
      const today = new Date().toISOString().split('T')[0];
      const todayScheduled = scheduled.filter(task => task.date === today);
      setScheduledTasks(todayScheduled);
    } catch (err) {
      console.error('Failed to load scheduled tasks:', err);
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, timeSlot) => {
    e.preventDefault();
    
    if (!draggedTask || !selectedChild) return;

    try {
      const newScheduledTask = {
        taskId: draggedTask.id,
        childId: selectedChild.id,
        time: timeSlot,
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      };

      await scheduledTaskService.create(newScheduledTask);
      await loadScheduledTasks(selectedChild.id);
      toast.success('Task scheduled successfully!');
    } catch (err) {
      toast.error('Failed to schedule task');
    }
    
    setDraggedTask(null);
  };

  const removeScheduledTask = async (taskId) => {
    try {
      await scheduledTaskService.delete(taskId);
      await loadScheduledTasks(selectedChild.id);
      toast.success('Task removed from schedule');
    } catch (err) {
      toast.error('Failed to remove task');
    }
  };

  const getTaskAtTime = (timeSlot) => {
    const scheduledTask = scheduledTasks.find(task => task.time === timeSlot);
    if (!scheduledTask) return null;
    
    const taskDetails = tasks.find(task => task.id === scheduledTask.taskId);
    return { ...scheduledTask, ...taskDetails };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-3 bg-white rounded-lg p-6 shadow-sm">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load schedule</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="text-center py-12">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="Calendar" className="w-16 h-16 text-gray-300 mx-auto" />
        </motion.div>
        <h3 className="mt-4 text-lg font-medium">No children to schedule</h3>
        <p className="mt-2 text-gray-500">Add a child first to create schedules</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-medium"
        >
          Add Child
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Schedule Builder</h1>
        <select
          value={selectedChild?.id || ''}
          onChange={(e) => {
            const child = children.find(c => c.id === e.target.value);
            setSelectedChild(child);
            loadScheduledTasks(child.id);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {children.map((child) => (
            <option key={child.id} value={child.id}>{child.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Task Library */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Tasks</h2>
          <div className="space-y-3">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors"
              >
                <div className="text-xl">{task.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm truncate">{task.title}</h3>
                  <p className="text-xs text-gray-500">{task.category} • {task.duration}min</p>
                </div>
                <ApperIcon name="GripVertical" className="w-4 h-4 text-gray-400" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Schedule Timeline */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Daily Schedule - {selectedChild?.name}
          </h2>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {timeSlots.map((timeSlot) => {
              const scheduledTask = getTaskAtTime(timeSlot);
              
              return (
                <div
                  key={timeSlot}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, timeSlot)}
                  className={`flex items-center p-4 border-2 border-dashed rounded-lg min-h-16 transition-colors ${
                    scheduledTask 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  <span className="text-sm font-medium text-gray-600 w-16 flex-shrink-0">
                    {timeSlot}
                  </span>
                  
                  {scheduledTask ? (
                    <div className="flex items-center space-x-3 flex-1 ml-4">
                      <div className="text-2xl">{scheduledTask.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900">{scheduledTask.title}</h3>
                        <p className="text-sm text-gray-600">
                          {scheduledTask.category} • {scheduledTask.duration} minutes
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          scheduledTask.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : scheduledTask.status === 'need_help'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {scheduledTask.status === 'completed' ? 'Done' : 
                           scheduledTask.status === 'need_help' ? 'Help' : 'Pending'}
                        </span>
                        <button
                          onClick={() => removeScheduledTask(scheduledTask.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 ml-4 text-gray-400 text-sm">
                      Drag a task here to schedule
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;