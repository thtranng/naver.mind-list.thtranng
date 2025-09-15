import React, { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Flag, Plus } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Task } from '@/types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { vi } from 'date-fns/locale';
import { AddTaskModal } from '../tasks/AddTaskModal';
import { calculateNextOccurrence } from '@/services/recurringTaskService';


export function CalendarView() {
  const { state } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Tính toán các ngày trong tháng
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Lấy tasks theo ngày (bao gồm cả recurring tasks)
  const getTasksForDate = (date: Date): Task[] => {
    // Lấy tasks thường
    const regularTasks = state.tasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), date)
    );

    // Lấy recurring tasks cho ngày này
    const recurringTasks: Task[] = [];
    
    // Tìm các template tasks có repeat settings
    const templateTasks = state.tasks.filter(task => 
      task.isTemplate && 
      task.timeSettings?.repeatSettings && 
      task.timeSettings.repeatSettings.type !== 'never'
    );

    // Tạo recurring tasks cho ngày được chọn
    templateTasks.forEach(template => {
      if (template.timeSettings?.repeatSettings && template.dueDate) {
        const templateDate = new Date(template.dueDate);
        const targetDate = new Date(date);
        
        // Kiểm tra xem ngày này có nằm trong khoảng repeat không
        if (targetDate >= templateDate) {
          // Kiểm tra end conditions
          const repeatSettings = template.timeSettings.repeatSettings;
          let shouldGenerate = true;
          
          if (repeatSettings.endType === 'date' && repeatSettings.endDate) {
            shouldGenerate = targetDate <= new Date(repeatSettings.endDate);
          }
          
          if (repeatSettings.endType === 'count' && repeatSettings.endCount) {
            const daysDiff = Math.floor((targetDate.getTime() - templateDate.getTime()) / (1000 * 60 * 60 * 24));
            const occurrenceCount = Math.floor(daysDiff / (repeatSettings.interval || 1)) + 1;
            shouldGenerate = occurrenceCount <= repeatSettings.endCount;
          }
          
          if (shouldGenerate) {
            // Tạo task cho ngày này dựa trên repeat pattern
            const daysDiff = Math.floor((targetDate.getTime() - templateDate.getTime()) / (1000 * 60 * 60 * 24));
            let shouldCreateTask = false;
            
            switch (repeatSettings.type) {
              case 'hourly':
                // Chỉ hiển thị trong ngày template được tạo
                shouldCreateTask = isSameDay(templateDate, targetDate);
                break;
              case 'daily':
                shouldCreateTask = daysDiff >= 0 && daysDiff % (repeatSettings.interval || 1) === 0;
                break;
              case 'weekdays':
                shouldCreateTask = targetDate.getDay() >= 1 && targetDate.getDay() <= 5;
                break;
              case 'weekends':
                shouldCreateTask = targetDate.getDay() === 0 || targetDate.getDay() === 6;
                break;
              case 'weekly':
                const weeksDiff = Math.floor(daysDiff / 7);
                shouldCreateTask = daysDiff >= 0 && weeksDiff % (repeatSettings.interval || 1) === 0 && targetDate.getDay() === templateDate.getDay();
                break;
              case 'monthly':
                const monthsDiff = (targetDate.getFullYear() - templateDate.getFullYear()) * 12 + (targetDate.getMonth() - templateDate.getMonth());
                shouldCreateTask = monthsDiff >= 0 && monthsDiff % (repeatSettings.interval || 1) === 0 && targetDate.getDate() === templateDate.getDate();
                break;
              case 'yearly':
                const yearsDiff = targetDate.getFullYear() - templateDate.getFullYear();
                shouldCreateTask = yearsDiff >= 0 && yearsDiff % (repeatSettings.interval || 1) === 0 && 
                  targetDate.getMonth() === templateDate.getMonth() && targetDate.getDate() === templateDate.getDate();
                break;
              default:
                shouldCreateTask = false;
            }
            
            if (shouldCreateTask) {
              // Kiểm tra xem task này đã được tạo thực tế chưa (không phải template)
              const existingTask = state.tasks.find(task => 
                !task.isTemplate && 
                task.templateId === template.id && 
                task.dueDate && 
                isSameDay(new Date(task.dueDate), targetDate)
              );
              
              // Nếu đã có task thực tế, ưu tiên hiển thị task đó thay vì tạo virtual task
              if (!existingTask) {
                const recurringTask: Task = {
                  ...template,
                  id: `${template.id}-${targetDate.toISOString().split('T')[0]}`,
                  dueDate: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), templateDate.getHours(), templateDate.getMinutes()),
                  isTemplate: false,
                  templateId: template.id,
                  title: template.title,
                  note: template.note ? `${template.note} (Lặp lại)` : 'Task lặp lại'
                };
                
                recurringTasks.push(recurringTask);
              }
            }
          }
        }
      }
    });

    return [...regularTasks, ...recurringTasks];
  };

  // Tasks cho ngày được chọn
  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'important': return 'bg-orange-500';
      default: return 'bg-gray-400';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">📅 Lịch công việc</h2>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => navigateMonth('prev')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="px-4 py-2 text-sm font-medium min-w-[140px] text-center">
                      {format(currentDate, 'MMMM yyyy', { locale: vi })}
                    </span>
                    <button 
                      onClick={() => navigateMonth('next')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                    <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const dayTasks = getTasksForDate(day);
                    const isToday = isSameDay(day, new Date());
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    
                    return (
                      <div 
                        key={index} 
                        className={`min-h-24 p-2 border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                          isToday ? 'bg-blue-50 border-blue-200' : ''
                        } ${
                          isSelected ? 'bg-blue-100 border-blue-300' : ''
                        }`}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm ${
                            isToday ? 'font-bold text-blue-600' : 'text-gray-600'
                          }`}>
                            {format(day, 'd')}
                          </span>
                          {dayTasks.length > 0 && (
                            <span className="text-xs bg-blue-500 text-white rounded-full px-1.5 py-0.5">
                              {dayTasks.length}
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          {dayTasks.slice(0, 2).map(task => (
                            <div 
                              key={task.id}
                              className="text-xs p-1 rounded bg-gray-100 truncate flex items-center gap-1"
                            >
                              <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                              <span className="truncate">{task.title}</span>
                            </div>
                          ))}
                          {dayTasks.length > 2 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{dayTasks.length - 2} khác
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Task Details Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedDate ? (
                      <>📋 Công việc ngày {format(selectedDate, 'd/M/yyyy')}</>
                    ) : (
                      '📋 Chọn ngày để xem công việc'
                    )}
                  </h3>
                  
                  {/* Quick Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-1 text-sm"
                      title="Add task"
                    >
                      <Plus size={16} />
                      <span className="hidden sm:inline">Add task</span>
                    </button>
                  </div>
                </div>
                
                {selectedDate ? (
                  <div className="space-y-3">
                    {selectedDateTasks.length > 0 ? (
                      selectedDateTasks.map(task => (
                        <div 
                          key={task.id}
                          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedTask(task);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-3 h-3 rounded-full mt-1 ${getPriorityColor(task.priority)}`}></div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
                              {task.dueDate && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock size={12} />
                                  {format(new Date(task.dueDate), 'HH:mm')}
                                </div>
                              )}
                              {task.priority !== 'none' && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                  <Flag size={12} />
                                  {task.priority === 'urgent' ? 'Khẩn cấp' : 'Quan trọng'}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                        <p>Không có công việc nào trong ngày này</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                    <p>Nhấp vào một ngày để xem chi tiết công việc</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Task Edit Modal */}
      <AddTaskModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        initialDate={selectedDate}
      />
      
      

    </div>
  );
}