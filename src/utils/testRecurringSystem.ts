// Test file for recurring task system

import {
  calculateNextOccurrence,
  shouldGenerateTask,
  generateRecurringTask,
  processRecurringTasks,
  getRecurringTasks,
  markTaskGenerated
} from '../services/recurringTaskService';

import { RepeatSettings, TaskTemplate } from '../types/repeat';

// Test calculateNextOccurrence
console.log('Testing calculateNextOccurrence...');

const dailyRepeat: RepeatSettings = {
  type: 'daily',
  interval: 1,
  endType: 'never'
};

const nextDate = calculateNextOccurrence(dailyRepeat, new Date('2024-01-01'));
console.log('Next daily occurrence:', nextDate);

// Test shouldGenerateTask
console.log('Testing shouldGenerateTask...');

const template: TaskTemplate = {
  id: 'test-template',
  title: 'Test Task',
  priority: 'medium',
  listId: 'test-list',
  repeatSettings: dailyRepeat,
  createdAt: new Date('2024-01-01'),
  lastGenerated: new Date('2024-01-01'),
  isActive: true
};

const shouldGenerate = shouldGenerateTask(template);
console.log('Should generate task:', shouldGenerate);

// Test generateRecurringTask
console.log('Testing generateRecurringTask...');

const recurringTask = generateRecurringTask(template);
console.log('Generated recurring task:', recurringTask);

// Test other functions
console.log('Testing processRecurringTasks...');
const tasks = processRecurringTasks();
console.log('Processed tasks:', tasks);

console.log('Testing getRecurringTasks...');
const allTasks = getRecurringTasks();
console.log('All recurring tasks:', allTasks);

console.log('Testing markTaskGenerated...');
markTaskGenerated('test-id');

console.log('All tests completed!');