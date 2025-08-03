import { TasksProvider } from './features/tasks/contexts/TasksContext';
import { MainLayout } from './components/layout/MainLayout';

export default function App() {
  return (
    <TasksProvider>
      <MainLayout />
    </TasksProvider>
  );
}