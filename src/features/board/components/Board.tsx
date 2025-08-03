import React, { useState, useEffect } from 'react';
import { Col, Row } from 'antd';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type {
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { StorageService } from '../../../services/storage.service';
import { ProjectInfo } from '../../project-info/components/ProjectInfo';
import { BoardFilters } from './BoardFilters';
import { Column } from './Column';
import { TaskCard } from '../../tasks/components/TaskCard';
import type { Task } from '../../tasks/types/task.types';
import type { TaskStatus, Priority, User } from '../../../types/global.types';

interface BoardProps {
  tasks: Task[];
  users: User[];
  searchQuery: string;
  onTaskEdit?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onAddTask?: (status?: TaskStatus) => void;
  onMoveTask?: (taskId: string, newStatus: TaskStatus) => void;
  onUsersUpdate?: () => void;
}

export function Board({ 
  tasks, 
  users, 
  searchQuery,
  onTaskEdit, 
  onTaskDelete, 
  onAddTask, 
  onMoveTask,
  onUsersUpdate
}: BoardProps) {
  // State management
  const [selectedPriority, setSelectedPriority] = useState<Priority | undefined>();
  const [selectedAssignee, setSelectedAssignee] = useState<string | undefined>();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [currentProjectInfo, setCurrentProjectInfo] = useState(StorageService.getProjectInfo());
  
  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 8 },
    }),
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  // Column definitions
  const columns: { id: TaskStatus; statusClass: string }[] = [
    { id: 'backlog', statusClass: 'status-backlog' },
    { id: 'todo', statusClass: 'status-todo' },
    { id: 'inProgress', statusClass: 'status-progress' },
    { id: 'needReview', statusClass: 'status-review' }
  ];
  
  // Combine users from props with project users
  const allUsers = React.useMemo(() => {
    const combinedUsers = [...users];
    const projectUsers = currentProjectInfo?.assignedUsers || [];
    
    projectUsers.forEach(projectUser => {
      if (!combinedUsers.find(user => user.id === projectUser.id)) {
        combinedUsers.push(projectUser);
      }
    });
    
    return combinedUsers;
  }, [users, currentProjectInfo?.assignedUsers]);
  
  // Initialize default project info if none exists
  useEffect(() => {
    StorageService.initializeDefaultProjectInfo();
    setCurrentProjectInfo(StorageService.getProjectInfo());
  }, []);

  // Apply all filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesPriority = !selectedPriority || task.priority === selectedPriority;
    const matchesAssignee = !selectedAssignee || task.assignee?.id === selectedAssignee;
    
    return matchesSearch && matchesPriority && matchesAssignee;
  });

  // Get tasks by status
  const getTasksByStatus = (status: TaskStatus): Task[] => {
    return filteredTasks.filter(task => task.status === status);
  };

  // Event handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveTask(null);
    
    if (!over) return;
    
    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    
    const taskToMove = tasks.find(t => t.id === taskId);
    if (!taskToMove || taskToMove.status === newStatus) return;
    
    const validStatuses: TaskStatus[] = ['backlog', 'todo', 'inProgress', 'needReview'];
    if (!validStatuses.includes(newStatus)) return;
    
    try {
      onMoveTask?.(taskId, newStatus);
    } catch (error) {
      console.error('Error moving task:', error);
    }
  };

  const clearFilters = () => {
    setSelectedPriority(undefined);
    setSelectedAssignee(undefined);
  };

  // Project-related handlers
  const handleAddUser = (user: { name: string; email: string }) => {
    StorageService.addUserToProject(user);
    const updatedProjectInfo = StorageService.getProjectInfo();
    setCurrentProjectInfo(updatedProjectInfo);
    onUsersUpdate?.();
  };

  const handleDateChange = (date: Date | null) => {
    StorageService.updateProjectDueDate(date);
    const updatedProjectInfo = StorageService.getProjectInfo();
    setCurrentProjectInfo(updatedProjectInfo);
  };

  const handleAddTag = (tag: string) => {
    StorageService.addProjectTag(tag);
    const updatedProjectInfo = StorageService.getProjectInfo();
    setCurrentProjectInfo(updatedProjectInfo);
  };

  const handleRemoveTag = (tag: string) => {
    StorageService.removeProjectTag(tag);
    const updatedProjectInfo = StorageService.getProjectInfo();
    setCurrentProjectInfo(updatedProjectInfo);
  };

  const handleProjectNameChange = (newName: string) => {
    StorageService.updateProjectName(newName);
    const updatedProjectInfo = StorageService.getProjectInfo();
    setCurrentProjectInfo(updatedProjectInfo);
  };

  return (
    <div className="board-container space-y-4">
      {/* Project Information Section */}
      <div 
        className="rounded-2xl p-6 shadow-lg border" 
        style={{ 
          backgroundColor: 'rgb(var(--bg-container))', 
          borderColor: 'rgb(var(--border-color))' 
        }}
      >
        <ProjectInfo 
          projectName={currentProjectInfo.name}
          assignedUsers={currentProjectInfo.assignedUsers}
          dueDate={currentProjectInfo.dueDate}
          tags={currentProjectInfo.tags}
          onAddUser={handleAddUser}
          onDateChange={handleDateChange}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onProjectNameChange={handleProjectNameChange}
        />
      </div>

      {/* Filters and Actions with Summary */}
      <BoardFilters 
        selectedPriority={selectedPriority}
        selectedAssignee={selectedAssignee}
        allUsers={allUsers}
        searchQuery={searchQuery}
        filteredTasks={filteredTasks}
        totalTasks={tasks.length}
        onPriorityChange={setSelectedPriority}
        onAssigneeChange={setSelectedAssignee}
        onClearFilters={clearFilters}
        onAddTask={() => onAddTask?.()}
      />

      {/* Board Columns with DnD */}
      <div>
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Row gutter={[8, 20]} className="w-full">
            {columns.map(({ id, statusClass }) => (
              <Col xs={24} sm={12} lg={6} key={id} className="w-full">
                <div className="rounded-2xl overflow-hidden shadow-lg h-full">
                  <Column
                    id={id}
                    statusClass={statusClass}
                    tasks={getTasksByStatus(id)}
                    onTaskEdit={onTaskEdit}
                    onTaskDelete={onTaskDelete}
                    onAddTask={onAddTask}
                  />
                </div>
              </Col>
            ))}
          </Row>

          <DragOverlay>
            {activeTask ? (
              <div className="animate-fade-in rounded-xl overflow-hidden shadow-2xl">
                <TaskCard task={activeTask} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}