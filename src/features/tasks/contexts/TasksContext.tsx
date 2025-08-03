import { createContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Task, TaskFormData } from '../types/task.types';
import type { User, TaskStatus } from '../../../types/global.types';
import { StorageService } from '../../../services/storage.service';

interface TasksState {
  tasks: Task[];
  users: User[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

type TasksAction =
  | { type: 'INITIALIZE'; payload: { tasks: Task[]; users: User[] } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'MOVE_TASK'; payload: { taskId: string; newStatus: TaskStatus } }
  | { type: 'ADD_USER'; payload: User };

interface TasksContextType {
  state: TasksState;
  addTask: (data: TaskFormData, status?: TaskStatus) => void;
  updateTask: (id: string, data: TaskFormData) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  addUser: (userData: { name: string; email: string }) => User;
  clearAllData: () => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

const initialState: TasksState = {
  tasks: [],
  users: [],
  loading: true,
  error: null,
  initialized: false,
};

function tasksReducer(state: TasksState, action: TasksAction): TasksState {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        tasks: action.payload.tasks,
        users: action.payload.users,
        loading: false,
        initialized: true,
      };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    
    case 'MOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.taskId
            ? { ...task, status: action.payload.newStatus, updatedAt: new Date() }
            : task
        ),
      };
    
    case 'ADD_USER': {
      const userExists = state.users.some(user => user.id === action.payload.id);
      if (userExists) {
        return state;
      }
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    }
    
    default:
      return state;
  }
}

interface TasksProviderProps {
  children: ReactNode;
}

export function TasksProvider({ children }: TasksProviderProps) {
  const [state, dispatch] = useReducer(tasksReducer, initialState);

  // Initialize data from localStorage on mount
  useEffect(() => {
    try {
      const storedTasks = StorageService.getTasks();
      const storedUsers = StorageService.getUsers();

      dispatch({ 
        type: 'INITIALIZE', 
        payload: { tasks: storedTasks, users: storedUsers } 
      });
    } catch (error) {
      console.error('Error initializing data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
    }
  }, []);

  const addTask = (data: TaskFormData, status: TaskStatus = 'backlog') => {
    try {
      const newTask: Task = {
        ...data,
        id: crypto.randomUUID(),
        status,
        assignee: data.assigneeId ? state.users.find(u => u.id === data.assigneeId) : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Save to localStorage
      StorageService.addTask(newTask);
      
      // Update state
      dispatch({ type: 'ADD_TASK', payload: newTask });
    } catch (error) {
      console.error('Error adding task:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add task' });
    }
  };

  const updateTask = (id: string, data: TaskFormData) => {
    try {
      const existingTask = state.tasks.find(task => task.id === id);
      if (!existingTask) return;

      const updatedTask: Task = {
        ...existingTask,
        ...data,
        assignee: data.assigneeId ? state.users.find(u => u.id === data.assigneeId) : undefined,
        updatedAt: new Date(),
      };
      
      // Save to localStorage
      StorageService.updateTask(updatedTask);
      
      // Update state
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
    } catch (error) {
      console.error('Error updating task:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update task' });
    }
  };

  const deleteTask = (id: string) => {
    try {
      // Remove from localStorage
      StorageService.deleteTask(id);
      
      // Update state
      dispatch({ type: 'DELETE_TASK', payload: id });
    } catch (error) {
      console.error('Error deleting task:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete task' });
    }
  };

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    try {
      // Update in localStorage
      StorageService.moveTask(taskId, newStatus);
      
      // Update state
      dispatch({ type: 'MOVE_TASK', payload: { taskId, newStatus } });
    } catch (error) {
      console.error('Error moving task:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to move task' });
    }
  };

  const addUser = (userData: { name: string; email: string }): User => {
    try {
      const newUser: User = {
        id: crypto.randomUUID(),
        name: userData.name,
        email: userData.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Save to localStorage
      StorageService.addUser(newUser);
      
      // Update state
      dispatch({ type: 'ADD_USER', payload: newUser });
      
      return newUser;
    } catch (error) {
      console.error('Error adding user:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add user' });
      throw error;
    }
  };

  const clearAllData = () => {
    try {
      StorageService.saveTasks([]);
      dispatch({ type: 'INITIALIZE', payload: { tasks: [], users: state.users } });
    } catch (error) {
      console.error('Error clearing data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear data' });
    }
  };

  return (
    <TasksContext.Provider value={{
      state,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      addUser,
      clearAllData,
    }}>
      {children}
    </TasksContext.Provider>
  );
}

export { TasksContext };