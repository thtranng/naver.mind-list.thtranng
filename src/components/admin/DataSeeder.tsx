import React, { useState } from 'react';
import { Database, Plus, Trash2, RefreshCw } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { createTask, deleteTask, getTasks } from '@/services/mockApi';

// Danh sách các task mẫu cho sinh viên Đại học Bách khoa Hà Nội
const studentTasks = [
  // Học tập
  {
    title: 'Nộp bài tập lớn Cấu trúc dữ liệu và giải thuật',
    note: 'Hoàn thành bài tập về cây nhị phân và thuật toán sắp xếp',
    isCompleted: false,
    priority: 'urgent' as const,
    listId: 'learning',
    dueDate: new Date('2024-02-15T23:59:00'),
    reminder: new Date('2024-02-14T09:00:00')
  },
  {
    title: 'Ôn tập môn Toán cao cấp A1',
    note: 'Ôn lại chương tích phân và vi phân để chuẩn bị thi cuối kỳ',
    isCompleted: false,
    priority: 'important' as const,
    listId: 'learning',
    dueDate: new Date('2024-02-20T08:00:00'),
    reminder: new Date('2024-02-18T19:00:00')
  },
  {
    title: 'Làm báo cáo môn Vật lý đại cương',
    note: 'Nghiên cứu về dao động điều hòa và viết báo cáo 10 trang',
    isCompleted: false,
    priority: 'important' as const,
    listId: 'learning',
    dueDate: new Date('2024-02-18T17:00:00')
  },
  {
    title: 'Học từ vựng tiếng Anh chuyên ngành',
    note: 'Học 50 từ vựng kỹ thuật mỗi tuần',
    isCompleted: false,
    priority: 'none' as const,
    listId: 'learning',
    dueDate: new Date('2024-02-25T20:00:00')
  },
  {
    title: 'Hoàn thành project môn Lập trình hướng đối tượng',
    note: 'Xây dựng ứng dụng quản lý thư viện bằng Java',
    isCompleted: false,
    priority: 'urgent' as const,
    listId: 'learning',
    dueDate: new Date('2024-02-22T23:59:00')
  },
  {
    title: 'Đăng ký môn học kỳ 2',
    note: 'Đăng ký các môn: Cơ sở dữ liệu, Mạng máy tính, Hệ điều hành',
    isCompleted: true,
    priority: 'urgent' as const,
    listId: 'learning',
    dueDate: new Date('2024-01-30T17:00:00')
  },

  // Sinh hoạt cá nhân
  {
    title: 'Đóng học phí học kỳ 2',
    note: 'Đóng học phí qua ngân hàng hoặc tại phòng tài chính',
    isCompleted: false,
    priority: 'urgent' as const,
    listId: 'personal',
    dueDate: new Date('2024-02-10T16:00:00')
  },
  {
    title: 'Mua sách giáo khoa mới',
    note: 'Mua sách Cơ sở dữ liệu và Mạng máy tính tại nhà sách Fahasa',
    isCompleted: false,
    priority: 'important' as const,
    listId: 'personal',
    dueDate: new Date('2024-02-12T18:00:00')
  },
  {
    title: 'Làm thẻ sinh viên mới',
    note: 'Làm lại thẻ sinh viên do bị mất, mang theo giấy tờ tùy thân',
    isCompleted: false,
    priority: 'important' as const,
    listId: 'personal',
    dueDate: new Date('2024-02-08T15:00:00')
  },
  {
    title: 'Tìm phòng trọ gần trường',
    note: 'Tìm phòng trọ khu vực Hai Bà Trưng, giá 2-3 triệu/tháng',
    isCompleted: false,
    priority: 'important' as const,
    listId: 'personal',
    dueDate: new Date('2024-02-28T20:00:00')
  },
  {
    title: 'Khám sức khỏe định kỳ',
    note: 'Khám sức khỏe tại trung tâm y tế trường để làm giấy xác nhận',
    isCompleted: false,
    priority: 'none' as const,
    listId: 'personal',
    dueDate: new Date('2024-02-16T14:00:00')
  },

  // Hoạt động ngoại khóa và phát triển bản thân
  {
    title: 'Tham gia CLB Lập trình HUST',
    note: 'Đăng ký tham gia câu lạc bộ để học hỏi và networking',
    isCompleted: false,
    priority: 'none' as const,
    listId: 'personal',
    dueDate: new Date('2024-02-14T17:00:00')
  },
  {
    title: 'Chuẩn bị cho cuộc thi ACM ICPC',
    note: 'Luyện tập thuật toán và cấu trúc dữ liệu mỗi ngày',
    isCompleted: false,
    priority: 'important' as const,
    listId: 'learning',
    dueDate: new Date('2024-03-15T09:00:00')
  },
  {
    title: 'Viết CV xin thực tập',
    note: 'Chuẩn bị CV để apply thực tập hè tại các công ty công nghệ',
    isCompleted: false,
    priority: 'important' as const,
    listId: 'working',
    dueDate: new Date('2024-02-29T20:00:00')
  },
  {
    title: 'Học online khóa React.js',
    note: 'Hoàn thành khóa học React.js trên Udemy để chuẩn bị thực tập',
    isCompleted: false,
    priority: 'important' as const,
    listId: 'learning',
    dueDate: new Date('2024-03-01T22:00:00')
  },
  {
    title: 'Tham gia hackathon HUST',
    note: 'Đăng ký tham gia hackathon để thử thách bản thân',
    isCompleted: false,
    priority: 'none' as const,
    listId: 'personal',
    dueDate: new Date('2024-02-24T18:00:00')
  },

  // Công việc part-time
  {
    title: 'Dạy kèm toán cho học sinh cấp 3',
    note: 'Dạy kèm 3 buổi/tuần, mỗi buổi 2 tiếng',
    isCompleted: false,
    priority: 'none' as const,
    listId: 'working',
    dueDate: new Date('2024-02-11T16:00:00')
  },
  {
    title: 'Làm freelance thiết kế web',
    note: 'Hoàn thành website cho khách hàng trong 2 tuần',
    isCompleted: false,
    priority: 'important' as const,
    listId: 'working',
    dueDate: new Date('2024-02-26T23:59:00')
  },
  {
    title: 'Viết content cho fanpage công nghệ',
    note: 'Viết 5 bài post về xu hướng công nghệ mới',
    isCompleted: false,
    priority: 'none' as const,
    listId: 'working',
    dueDate: new Date('2024-02-20T18:00:00')
  },

  // Sức khỏe và thể thao
  {
    title: 'Tập gym 3 lần/tuần',
    note: 'Duy trì lịch tập gym để có sức khỏe tốt cho việc học',
    isCompleted: false,
    priority: 'none' as const,
    listId: 'fitness',
    dueDate: new Date('2024-02-17T19:00:00')
  },
  {
    title: 'Chạy bộ quanh hồ Bách Khoa',
    note: 'Chạy bộ 30 phút mỗi sáng để tăng cường sức khỏe',
    isCompleted: false,
    priority: 'none' as const,
    listId: 'fitness',
    dueDate: new Date('2024-02-09T06:30:00')
  },

  // Mua sắm và sinh hoạt
  {
    title: 'Mua đồ dùng học tập',
    note: 'Mua vở, bút, máy tính cầm tay Casio fx-580VN X',
    isCompleted: false,
    priority: 'none' as const,
    listId: 'shopping',
    dueDate: new Date('2024-02-13T16:00:00')
  },
  {
    title: 'Mua quần áo mùa đông',
    note: 'Mua áo khoác và quần dài cho mùa đông Hà Nội',
    isCompleted: false,
    priority: 'none' as const,
    listId: 'shopping',
    dueDate: new Date('2024-02-15T19:00:00')
  }
];

export function DataSeeder() {
  const { dispatch } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const addAllStudentTasks = async () => {
    setIsLoading(true);
    setMessage('Đang thêm các task mẫu...');
    
    try {
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < studentTasks.length; i++) {
        try {
          const task = await createTask(studentTasks[i]);
          dispatch({ type: 'ADD_TASK', payload: task });
          successCount++;
          setMessage(`Đã thêm ${successCount}/${studentTasks.length} task...`);
          // Delay để tránh tạo quá nhanh
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Lỗi khi thêm task: ${studentTasks[i].title}`, error);
          errorCount++;
        }
      }
      
      setMessage(`🎉 Hoàn thành! Đã thêm ${successCount} task thành công${errorCount > 0 ? `, ${errorCount} task lỗi` : ''}`);
    } catch (error) {
      setMessage('❌ Có lỗi xảy ra khi thêm task');
      console.error('Error adding tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTasks = async () => {
    setIsLoading(true);
    setMessage('Đang tải lại danh sách task...');
    
    try {
      const tasks = await getTasks();
      dispatch({ type: 'SET_TASKS', payload: tasks });
      setMessage('✅ Đã tải lại danh sách task thành công');
    } catch (error) {
      setMessage('❌ Có lỗi khi tải lại task');
      console.error('Error refreshing tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <Database className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Quản lý dữ liệu mẫu</h3>
      </div>
      
      <p className="text-gray-600 mb-6">
        Thêm các task mẫu cho sinh viên Đại học Bách khoa Hà Nội để test tính năng Recently Edited và Recently Deleted.
      </p>
      
      <div className="space-y-4">
        <div className="flex gap-3">
          <button
            onClick={addAllStudentTasks}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isLoading ? 'Đang thêm...' : `Thêm ${studentTasks.length} task mẫu`}
          </button>
          
          <button
            onClick={refreshTasks}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Tải lại danh sách
          </button>
        </div>
        
        {message && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700">{message}</p>
          </div>
        )}
        
        <div className="text-sm text-gray-500">
          <p><strong>Lưu ý:</strong> Các task sẽ được thêm vào các danh sách có sẵn (Learning, Working, Personal, Fitness, Shopping).</p>
          <p>Sau khi thêm, bạn có thể test tính năng Recently Edited bằng cách chỉnh sửa một số task.</p>
        </div>
      </div>
    </div>
  );
}