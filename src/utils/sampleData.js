/**
 * Sample data for demonstrating session storage functionality
 * This will be used to populate initial data if no session storage exists
 */

export const sampleNotes = [
  {
    id: '1',
    title: 'Project Ideas',
    content: 'Some ideas for future projects:\n\n- Build a note-taking app with React\n- Create a task management system\n- Develop a personal dashboard\n- Learn more about Redux state management',
    tags: ['project', 'ideas', 'development'],
    createdAt: '2025-08-25T10:00:00.000Z',
    updatedAt: '2025-08-25T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Meeting Notes - Team Sync',
    content: 'Team sync meeting notes:\n\n- Discussed current sprint progress\n- Reviewed upcoming deadlines\n- Assigned new tasks to team members\n- Planned next week\'s priorities',
    tags: ['meeting', 'team', 'work'],
    createdAt: '2025-08-26T14:30:00.000Z',
    updatedAt: '2025-08-26T14:30:00.000Z',
  },
  {
    id: '3',
    title: 'Shopping List',
    content: 'Things to buy this weekend:\n\n- Groceries: milk, bread, eggs, fruits\n- Household items: paper towels, cleaning supplies\n- Electronics: new phone charger\n- Books: JavaScript advanced patterns',
    tags: ['shopping', 'personal'],
    createdAt: '2025-08-27T09:15:00.000Z',
    updatedAt: '2025-08-27T09:15:00.000Z',
  },
];

export const sampleNotesUIState = {
  sortBy: 'updatedAt',
};

export const sampleTasks = [
  {
    id: '1',
    name: 'Clean the house',
    description: 'Clean all rooms including kitchen, bathroom, and living room',
    dueDate: '2025-08-28',
    status: 'waiting',
    createdAt: '2025-08-25T10:00:00.000Z',
    updatedAt: '2025-08-25T10:00:00.000Z',
  },
  {
    id: '2',
    name: 'Clean the house',
    description: 'Deep clean the entire house for the weekend guests',
    dueDate: '2025-08-29',
    status: 'completed',
    createdAt: '2025-08-25T11:00:00.000Z',
    updatedAt: '2025-08-26T15:30:00.000Z',
  },
  {
    id: '3',
    name: 'Clean the house',
    description: 'Regular weekly house cleaning routine',
    dueDate: '2025-08-30',
    status: 'cancelled',
    createdAt: '2025-08-25T12:00:00.000Z',
    updatedAt: '2025-08-27T09:15:00.000Z',
  },
];

export const sampleUIState = {
  showCancelled: false,
  showCompleted: false,
  sortBy: 'dueDate',
};

export const sampleUserPreferences = {
  theme: 'light',
  dateFormat: 'MM-DD-YYYY',
  notifications: true,
  autoSave: true,
  defaultTaskStatus: 'waiting',
};

/**
 * Initialize session storage with sample notes data if it's empty
 */
export const initializeSampleNotesData = () => {
  const { SessionStorage, NoteStorage } = require('./localStorage');
  
  // Only initialize if session storage is available and empty
  if (SessionStorage.isAvailable()) {
    const existingNotes = NoteStorage.loadNotes();
    if (existingNotes.length === 0) {
      NoteStorage.saveNotes(sampleNotes);
      NoteStorage.saveNotesUIState(sampleNotesUIState);
      
      console.log('🚀 Initialized session storage with sample notes data');
      return true;
    }
  }
  
  return false;
};

/**
 * Initialize session storage with sample data if it's empty
 */
export const initializeSampleData = () => {
  const { SessionStorage, TaskStorage, UserPreferencesStorage } = require('./localStorage');
  
  // Only initialize if session storage is available and empty
  if (SessionStorage.isAvailable()) {
    const existingTasks = TaskStorage.loadTasks();
    if (existingTasks.length === 0) {
      TaskStorage.saveTasks(sampleTasks);
      TaskStorage.saveTasksUIState(sampleUIState);
      UserPreferencesStorage.savePreferences(sampleUserPreferences);
      
      console.log('🚀 Initialized session storage with sample data');
      return true;
    }
  }
  
  return false;
};
