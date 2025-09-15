import React, { useState } from 'react';
import { X, UserPlus, Link, Copy, Mail, Settings } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string;
}

type Permission = 'editor' | 'commenter' | 'viewer';
type LinkAccess = 'restricted' | 'anyone';

interface SharedUser {
  id: string;
  email: string;
  permission: Permission;
  name?: string;
}

export function ShareModal({ isOpen, onClose, taskTitle }: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<'people' | 'link'>('people');
  const [emailInput, setEmailInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [selectedPermission, setSelectedPermission] = useState<Permission>('viewer');
  const [linkAccess, setLinkAccess] = useState<LinkAccess>('restricted');
  const [linkPermission, setLinkPermission] = useState<Permission>('viewer');
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleInviteUser = () => {
    if (!emailInput.trim()) return;

    const newUser: SharedUser = {
      id: Date.now().toString(),
      email: emailInput.trim(),
      permission: selectedPermission,
    };

    setSharedUsers([...sharedUsers, newUser]);
    setEmailInput('');
    setMessageInput('');
  };

  const handleRemoveUser = (userId: string) => {
    setSharedUsers(sharedUsers.filter(user => user.id !== userId));
  };

  const handleChangePermission = (userId: string, permission: Permission) => {
    setSharedUsers(sharedUsers.map(user => 
      user.id === userId ? { ...user, permission } : user
    ));
  };

  const handleCopyLink = () => {
    const shareLink = `${window.location.origin}/shared/task/${Date.now()}`;
    navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const getPermissionLabel = (permission: Permission) => {
    switch (permission) {
      case 'editor': return 'Người chỉnh sửa';
      case 'commenter': return 'Người bình luận';
      case 'viewer': return 'Người xem';
    }
  };

  const getPermissionDescription = (permission: Permission) => {
    switch (permission) {
      case 'editor': return 'Có thể chỉnh sửa và chia sẻ';
      case 'commenter': return 'Có thể bình luận và đề xuất';
      case 'viewer': return 'Chỉ có thể xem';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <UserPlus size={20} className="text-gray-600" />
              <h3 className="text-lg font-semibold">Chia sẻ "{taskTitle}"</h3>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X size={16} className="text-gray-600" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('people')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'people'
                  ? 'border-mind-list-primary-blue text-mind-list-primary-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Mời người khác
            </button>
            <button
              onClick={() => setActiveTab('link')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'link'
                  ? 'border-mind-list-primary-blue text-mind-list-primary-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Chia sẻ liên kết
            </button>
          </div>

          {/* People Tab */}
          {activeTab === 'people' && (
            <div className="space-y-4">
              {/* Invite form */}
              <div className="space-y-3">
                <div>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Nhập địa chỉ email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-mind-list-primary-blue"
                  />
                </div>
                
                <div>
                  <select
                    value={selectedPermission}
                    onChange={(e) => setSelectedPermission(e.target.value as Permission)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-mind-list-primary-blue"
                  >
                    <option value="viewer">Người xem - Chỉ có thể xem</option>
                    <option value="commenter">Người bình luận - Có thể bình luận và đề xuất</option>
                    <option value="editor">Người chỉnh sửa - Có thể chỉnh sửa và chia sẻ</option>
                  </select>
                </div>

                <div>
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Thêm tin nhắn (tùy chọn)"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-mind-list-primary-blue resize-none"
                  />
                </div>

                <button
                  onClick={handleInviteUser}
                  disabled={!emailInput.trim()}
                  className="w-full px-4 py-2 bg-mind-list-primary-blue text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Mail size={16} />
                  Gửi lời mời
                </button>
              </div>

              {/* Shared users list */}
              {sharedUsers.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Những người có quyền truy cập</h4>
                  {sharedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-mind-list-primary-blue rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-700">{user.email}</div>
                          <div className="text-xs text-gray-500">{getPermissionDescription(user.permission)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={user.permission}
                          onChange={(e) => handleChangePermission(user.id, e.target.value as Permission)}
                          className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-mind-list-primary-blue"
                        >
                          <option value="viewer">Người xem</option>
                          <option value="commenter">Người bình luận</option>
                          <option value="editor">Người chỉnh sửa</option>
                        </select>
                        <button
                          onClick={() => handleRemoveUser(user.id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Link Tab */}
          {activeTab === 'link' && (
            <div className="space-y-4">
              {/* Link access settings */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quyền truy cập liên kết
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="linkAccess"
                        value="restricted"
                        checked={linkAccess === 'restricted'}
                        onChange={(e) => setLinkAccess('restricted')}
                        className="mr-2"
                      />
                      <div>
                        <div className="text-sm font-medium">Hạn chế</div>
                        <div className="text-xs text-gray-500">Chỉ những người có quyền truy cập mới có thể mở</div>
                      </div>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="linkAccess"
                        value="anyone"
                        checked={linkAccess === 'anyone'}
                        onChange={(e) => setLinkAccess('anyone')}
                        className="mr-2"
                      />
                      <div>
                        <div className="text-sm font-medium">Bất kỳ ai có liên kết</div>
                        <div className="text-xs text-gray-500">Bất kỳ ai trên internet có liên kết đều có thể truy cập</div>
                      </div>
                    </label>
                  </div>
                </div>

                {linkAccess === 'anyone' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quyền cho người dùng liên kết
                    </label>
                    <select
                      value={linkPermission}
                      onChange={(e) => setLinkPermission(e.target.value as Permission)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-mind-list-primary-blue"
                    >
                      <option value="viewer">Người xem - Chỉ có thể xem</option>
                      <option value="commenter">Người bình luận - Có thể bình luận và đề xuất</option>
                      <option value="editor">Người chỉnh sửa - Có thể chỉnh sửa và chia sẻ</option>
                    </select>
                  </div>
                )}

                {/* Copy link button */}
                <button
                  onClick={handleCopyLink}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
                >
                  <Copy size={16} />
                  {linkCopied ? 'Đã sao chép liên kết!' : 'Sao chép liên kết'}
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Hoàn thành
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}