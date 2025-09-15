import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  FileText,
  Plus,
  Trash2,
  Flag,
  AlertTriangle,
  X,
  User,
  MapPin,
  Link,
  Image,
  Paperclip
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Task, SubTask } from '@/types';
import { DatePicker } from '../ui/date-picker';
import { TimeSettingsModal, TimeSettings } from './TimeSettingsModal';
import { DetailsMenu } from './DetailsMenu';
import { ShareModal } from './ShareModal';
import { ListSelector } from './ListSelector';
import { DateTimePicker } from './DateTimePicker';
import CircularProgress from './CircularProgress';
import { BlockEditor, Block } from '../ui/BlockEditor';
import { LocationData } from '../ui/LocationPicker';
import { createTask, updateTask, deleteTask } from '../../services/mockApi';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  initialDate?: Date | null;
}

export function AddTaskModal({ isOpen, onClose, task, initialDate }: AddTaskModalProps) {
  const { state, dispatch } = useApp();
  const { state: onboardingState, markTaskCreated, markDueDateSet } = useOnboarding();
  const [taskTitle, setTaskTitle] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [priority, setPriority] = useState<'none' | 'important' | 'urgent'>('none');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  
  // Custom setDueDate handler for onboarding
  const handleDueDateChange = (date: Date | undefined) => {
    setDueDate(date);
    
    // Check if onboarding is active and this is due date setting step
    if (onboardingState.isActive && onboardingState.currentStep === 'first_task_creation' && date) {
      markDueDateSet();
    }
  };
  const [reminder, setReminder] = useState<Date | undefined>();
  const [selectedListId, setSelectedListId] = useState('all');
  const [location, setLocation] = useState<LocationData | null>(null);
  const [attachments, setAttachments] = useState<{type: 'link' | 'photo' | 'file', url: string, title?: string}[]>([]);
  
  // Modal states
  const [showTimeSettings, setShowTimeSettings] = useState(false);
  const [showDetailsMenu, setShowDetailsMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showListSelector, setShowListSelector] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeSettings, setTimeSettings] = useState<TimeSettings>({
    earlyReminder: 'none',
    repeatSettings: {
      type: 'never',
      interval: 1,
      endType: 'never',
      isActive: true
    }
  });
  
  // Progress calculation based on checklist items in blocks
  const checklistItems = blocks.filter(block => block.type === 'checklist_item');
  const progressPercentage = checklistItems.length > 0 
    ? Math.round((checklistItems.filter(item => item.checked).length / checklistItems.length) * 100)
    : 0;

  // Convert blocks to legacy format for API compatibility
  const details = blocks
    .filter(block => block.type === 'paragraph')
    .map(block => block.content)
    .join('\n');
    
  const subTasks: SubTask[] = blocks
    .filter(block => block.type === 'checklist_item')
    .map(block => ({
      id: block.id,
      title: block.content,
      isCompleted: block.checked || false
    }));

  useEffect(() => {
    if (task) {
      setTaskTitle(task.title);
      
      // Convert legacy data to blocks format
      const newBlocks: Block[] = [];
      
      // Add paragraph blocks from note
      if (task.note) {
        const paragraphs = task.note.split('\n').filter(p => p.trim());
        paragraphs.forEach(paragraph => {
          newBlocks.push({
            id: Date.now().toString() + Math.random(),
            type: 'paragraph',
            content: paragraph
          });
        });
      }
      
      // Add checklist items from subTasks
      if (task.subTasks) {
        task.subTasks.forEach(subTask => {
          newBlocks.push({
            id: subTask.id,
            type: 'checklist_item',
            content: subTask.title,
            checked: subTask.isCompleted
          });
        });
      }
      
      // If no blocks, add empty paragraph
      if (newBlocks.length === 0) {
        newBlocks.push({
          id: Date.now().toString(),
          type: 'paragraph',
          content: ''
        });
      }
      
      setBlocks(newBlocks);
      setIsCompleted(task.isCompleted);
      setPriority(task.priority);
      handleDueDateChange(task.dueDate);
      setReminder(task.reminder);
      setSelectedListId(task.listId);
      // Load timeSettings from task
      if (task.timeSettings) {
        setTimeSettings({
          time: task.timeSettings.time,
          earlyReminder: task.timeSettings.earlyReminder,
          customReminderValue: task.timeSettings.customReminderValue,
          customReminderUnit: task.timeSettings.customReminderUnit,
          repeatSettings: task.timeSettings.repeatSettings || {
            type: task.timeSettings.repeat || 'never',
            interval: 1,
            endType: task.timeSettings.endRepeat === 'forever' ? 'never' : 'date',
            endDate: task.timeSettings.endRepeatDate,
            isActive: true
          }
        });
      }
      // TODO: Load location and attachments from task data
      setLocation(null);
      setAttachments([]);
    } else {
      // Reset form for new task
      setTaskTitle('');
      setBlocks([{
        id: Date.now().toString(),
        type: 'paragraph',
        content: ''
      }]);
      setIsCompleted(false);
      setPriority('none');
      handleDueDateChange(initialDate || undefined);
      setReminder(undefined);
      setSelectedListId('all');
      setLocation(null);
      setAttachments([]);
      // Reset timeSettings for new task
      setTimeSettings({
        earlyReminder: 'none',
        repeatSettings: {
          type: 'never',
          interval: 1,
          endType: 'never',
          isActive: true
        }
      });
    }
    // Reset modal states
    setShowTimeSettings(false);
    setShowDetailsMenu(false);
    setShowShareModal(false);
    setShowListSelector(false);
    setShowDateTimePicker(false);
  }, [task, isOpen, initialDate]);

  // Calculate progress based on subtasks
  const calculateProgress = () => {
    if (subTasks.length === 0) return 0;
    const completedSubTasks = subTasks.filter(st => st.isCompleted).length;
    return Math.round((completedSubTasks / subTasks.length) * 100);
  };

  const handleSave = async () => {
    if (!taskTitle.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const taskData = {
        title: taskTitle,
        note: details,
        isCompleted,
        dueDate,
        reminder,
        priority,
        listId: selectedListId,
        subTasks,
        repeat: timeSettings.repeatSettings?.type || 'never',
        timeSettings: {
          time: timeSettings.time,
          earlyReminder: timeSettings.earlyReminder,
          customReminderValue: timeSettings.customReminderValue,
          customReminderUnit: timeSettings.customReminderUnit,
          repeat: timeSettings.repeatSettings?.type || 'never',
          endRepeat: ((timeSettings.repeatSettings?.endType === 'never' || timeSettings.repeatSettings?.endType === 'count') ? 'forever' : 'date') as 'forever' | 'date',
          endRepeatDate: timeSettings.repeatSettings?.endDate,
          repeatSettings: timeSettings.repeatSettings,
        },
        isTemplate: timeSettings.repeatSettings?.type !== 'never',
      };

      if (task) {
        // Update existing task
        const updatedTask = await updateTask(task.id, taskData);
        dispatch({
          type: 'UPDATE_TASK',
          payload: { id: task.id, updates: updatedTask }
        });
      } else {
        // Create new task
        const newTask = await createTask(taskData);
        dispatch({
          type: 'ADD_TASK',
          payload: newTask
        });
        
        // Check if onboarding is active and this is task creation step
        if (onboardingState.isActive && onboardingState.currentStep === 'first_task_creation') {
          markTaskCreated();
        }
      }

      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
      // TODO: Show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubTask = (subTaskTitle: string) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type: 'checklist_item',
      content: subTaskTitle,
      checked: false
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleAddChecklistItem = () => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type: 'checklist_item',
      content: '',
      checked: false
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleDelete = async () => {
    if (!task || isLoading) return;

    setIsLoading(true);
    try {
      // Soft delete: mark as deleted instead of removing completely
      await updateTask(task.id, { isDeleted: true });
      dispatch({
        type: 'SOFT_DELETE_TASK',
        payload: task.id
      });
      dispatch({
        type: 'ADD_TO_RECENTLY_DELETED',
        payload: { item: task, type: 'task' }
      });
      onClose();
    } catch (error) {
      console.error('Error deleting task:', error);
      // TODO: Show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {task ? 'Chỉnh sửa công việc' : 'Tạo công việc mới'}
            </h2>
          </div>

          {/* Khu vực thông tin chính */}
          <div className="flex-1 px-6 py-4 space-y-6">
            {/* Header với checkbox, tiêu đề và progress bar */}
            <div className="flex items-start gap-4">
              {/* Checkbox hoàn thành */}
              <button
                onClick={() => setIsCompleted(!isCompleted)}
                className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1
                  ${isCompleted 
                    ? 'bg-mind-list-primary-blue border-mind-list-primary-blue' 
                    : 'border-gray-300 hover:border-mind-list-primary-blue'
                  }
                `}
              >
                {isCompleted && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              {/* Tiêu đề công việc */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Tiêu đề công việc"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className={`
                    w-full text-xl font-medium placeholder-gray-400 border-none outline-none bg-transparent
                    ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}
                  `}
                  autoFocus
                />
              </div>

              {/* Vòng tròn tiến độ - chỉ hiển thị khi có checklist items */}
              {checklistItems.length > 0 && (
                <div className="flex-shrink-0">
                  <CircularProgress 
                    progress={progressPercentage}
                    size={50}
                    strokeWidth={3}
                  />
                </div>
              )}
            </div>

            {/* Block Editor - Chi tiết và công việc con */}
            <div>
              <BlockEditor
                value={blocks}
                onChange={setBlocks}
                placeholder="Chi tiết công việc..."
                className="border border-gray-200 rounded-lg p-3 focus-within:border-mind-list-primary-blue focus-within:ring-1 focus-within:ring-mind-list-primary-blue"
              />
            </div>

            {/* Location */}
            {location && location.name && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} className="text-gray-500" />
                <span>{location.name}</span>
                <span className="text-xs text-gray-400">• {location.address}</span>
              </div>
            )}

            {/* Attachments */}
            {attachments.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Tệp đính kèm</h4>
                <div className="space-y-2">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      {attachment.type === 'link' && <Link size={16} className="text-blue-500" />}
                      {attachment.type === 'photo' && <Image size={16} className="text-green-500" />}
                      {attachment.type === 'file' && <Paperclip size={16} className="text-gray-500" />}
                      <span className="flex-1">{attachment.title || attachment.url}</span>
                      <button
                        onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Thanh công cụ chức năng */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {/* Chọn Ngày */}
                <div className="relative">
                  <button 
                    id="due-date-picker"
                    onClick={() => setShowDateTimePicker(true)}
                    className={`p-2 hover:bg-white rounded-lg transition-colors ${
                      dueDate ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                    }`}
                    title="Chọn ngày & giờ"
                  >
                    <Calendar size={18} />
                  </button>
                </div>

                {/* Chọn Thời gian */}
                <button 
                  onClick={() => setShowTimeSettings(true)}
                  className={`p-2 hover:bg-white rounded-lg transition-colors ${
                    reminder ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                  }`}
                  title="Cài đặt thời gian"
                >
                  <Clock size={18} />
                </button>



                {/* Thêm Chi tiết */}
                <div className="relative">
                  <button 
                    onClick={() => setShowDetailsMenu(!showDetailsMenu)}
                    className={`p-2 hover:bg-white rounded-lg transition-colors ${
                      (location && location.name) || attachments.length > 0 ? 'bg-green-50 text-green-600' : 'text-gray-600'
                    }`}
                    title="Thêm chi tiết"
                  >
                    <FileText size={18} />
                  </button>
                  <DetailsMenu
                    isOpen={showDetailsMenu}
                    onClose={() => setShowDetailsMenu(false)}
                    onAddLocation={setLocation}
                    onAddLink={(url, title) => setAttachments([...attachments, {type: 'link', url, title}])}
                    onAddPhoto={(file) => setAttachments([...attachments, {type: 'photo', url: URL.createObjectURL(file), title: file.name}])}
                    onAddFile={(file) => setAttachments([...attachments, {type: 'file', url: URL.createObjectURL(file), title: file.name}])}
                    selectedLocation={location}
                  />
                </div>

                {/* Thêm vào Danh sách */}
                <div className="relative">
                  <button 
                    onClick={() => setShowListSelector(!showListSelector)}
                    className={`p-2 hover:bg-white rounded-lg transition-colors ${
                      selectedListId !== 'all' ? 'bg-purple-50 text-purple-600' : 'text-gray-600'
                    }`}
                    title="Thêm vào danh sách"
                  >
                    <Plus size={18} />
                  </button>
                  <ListSelector
                    isOpen={showListSelector}
                    onClose={() => setShowListSelector(false)}
                    selectedListId={selectedListId}
                    onSelectList={setSelectedListId}
                  />
                </div>

                {/* Share */}
                <button 
                  onClick={() => setShowShareModal(true)}
                  className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600"
                  title="Chia sẻ"
                >
                  <User size={18} />
                </button>

                {/* Xóa */}
                <button 
                  onClick={handleDelete}
                  className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600 hover:text-red-500"
                  title="Xóa"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex items-center gap-1">
                {/* Đặt Mức độ Ưu tiên */}
                <button 
                  onClick={() => setPriority(priority === 'important' ? 'none' : 'important')}
                  className={`p-2 hover:bg-white rounded-lg transition-colors ${
                    priority === 'important' ? 'bg-orange-50 text-orange-500' : 'text-gray-600'
                  }`}
                  title="Đánh dấu quan trọng"
                >
                  <Flag size={18} />
                </button>

                <button 
                  onClick={() => setPriority(priority === 'urgent' ? 'none' : 'urgent')}
                  className={`p-2 hover:bg-white rounded-lg transition-colors ${
                    priority === 'urgent' ? 'bg-red-50 text-red-500' : 'text-gray-600'
                  }`}
                  title="Đánh dấu khẩn cấp"
                >
                  <AlertTriangle size={18} />
                </button>


              </div>
            </div>
          </div>

          {/* Footer với nút hành động */}
          <div className="px-6 py-4 border-t border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              
              <button
                onClick={handleSave}
                disabled={!taskTitle.trim() || isLoading}
                className="px-6 py-2 bg-mind-list-primary-blue text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isLoading ? 'Đang lưu...' : (task ? 'Cập nhật' : 'Lưu công việc')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TimeSettingsModal
        isOpen={showTimeSettings}
        onClose={() => setShowTimeSettings(false)}
        onSave={setTimeSettings}
        initialSettings={timeSettings}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        taskTitle={taskTitle || 'Untitled Task'}
      />

      <DateTimePicker
          isOpen={showDateTimePicker}
          onClose={() => setShowDateTimePicker(false)}
          dueDate={dueDate}
          onDueDateChange={handleDueDateChange}
        />
    </div>
  );
}