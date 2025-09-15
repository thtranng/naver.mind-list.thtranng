import React, { useState, useRef, useEffect } from 'react';
import { CheckSquare, Type, Plus, X, GripVertical } from 'lucide-react';

export interface Block {
  id: string;
  type: 'paragraph' | 'checklist_item';
  content: string;
  checked?: boolean;
}

interface BlockEditorProps {
  value: Block[];
  onChange: (blocks: Block[]) => void;
  placeholder?: string;
  className?: string;
}

export function BlockEditor({ value, onChange, placeholder = "Chi tiết công việc...", className = "" }: BlockEditorProps) {
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | HTMLTextAreaElement }>({});

  // Initialize with empty paragraph if no blocks
  useEffect(() => {
    if (value.length === 0) {
      const initialBlock: Block = {
        id: Date.now().toString(),
        type: 'paragraph',
        content: ''
      };
      onChange([initialBlock]);
    }
  }, [value.length, onChange]);

  const updateBlock = (blockId: string, updates: Partial<Block>) => {
    const newBlocks = value.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    );
    onChange(newBlocks);
  };

  const addBlock = (afterBlockId: string, type: 'paragraph' | 'checklist_item' = 'paragraph') => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: '',
      ...(type === 'checklist_item' && { checked: false })
    };
    
    const afterIndex = value.findIndex(block => block.id === afterBlockId);
    const newBlocks = [
      ...value.slice(0, afterIndex + 1),
      newBlock,
      ...value.slice(afterIndex + 1)
    ];
    
    onChange(newBlocks);
    
    // Focus the new block
    setTimeout(() => {
      const input = inputRefs.current[newBlock.id];
      if (input) {
        input.focus();
        setFocusedBlockId(newBlock.id);
      }
    }, 0);
  };

  const deleteBlock = (blockId: string) => {
    if (value.length <= 1) return; // Keep at least one block
    
    const blockIndex = value.findIndex(block => block.id === blockId);
    const newBlocks = value.filter(block => block.id !== blockId);
    onChange(newBlocks);
    
    // Focus previous block if exists
    if (blockIndex > 0) {
      const prevBlock = newBlocks[blockIndex - 1];
      setTimeout(() => {
        const input = inputRefs.current[prevBlock.id];
        if (input) {
          input.focus();
          setFocusedBlockId(prevBlock.id);
        }
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, blockId: string) => {
    const block = value.find(b => b.id === blockId);
    if (!block) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      addBlock(blockId, 'paragraph');
    } else if (e.key === 'Backspace' && block.content === '') {
      e.preventDefault();
      deleteBlock(blockId);
    }
  };

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedBlockId(blockId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault();
    
    if (!draggedBlockId || draggedBlockId === targetBlockId) {
      setDraggedBlockId(null);
      return;
    }

    const draggedIndex = value.findIndex(block => block.id === draggedBlockId);
    const targetIndex = value.findIndex(block => block.id === targetBlockId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newBlocks = [...value];
    const [draggedBlock] = newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(targetIndex, 0, draggedBlock);
    
    onChange(newBlocks);
    setDraggedBlockId(null);
  };

  const addChecklistItem = () => {
    const lastBlock = value[value.length - 1];
    addBlock(lastBlock.id, 'checklist_item');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {value.map((block, index) => (
        <div
          key={block.id}
          className={`group relative flex items-start gap-2 ${draggedBlockId === block.id ? 'opacity-50' : ''}`}
          draggable
          onDragStart={(e) => handleDragStart(e, block.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, block.id)}
        >
          {/* Drag handle */}
          <button
            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing transition-opacity"
            onMouseDown={(e) => e.preventDefault()}
          >
            <GripVertical size={14} />
          </button>

          {/* Block content */}
          <div className="flex-1 min-w-0">
            {block.type === 'checklist_item' ? (
              <div className="flex items-start gap-2">
                <button
                  onClick={() => updateBlock(block.id, { checked: !block.checked })}
                  className={`w-4 h-4 mt-1 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    block.checked
                      ? 'bg-mind-list-primary-blue border-mind-list-primary-blue text-white'
                      : 'border-gray-300 hover:border-mind-list-primary-blue'
                  }`}
                >
                  {block.checked && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <input
                  ref={(el) => {
                    if (el) inputRefs.current[block.id] = el;
                  }}
                  type="text"
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                  onKeyDown={(e) => handleKeyDown(e, block.id)}
                  onFocus={() => setFocusedBlockId(block.id)}
                  onBlur={() => setFocusedBlockId(null)}
                  placeholder="Công việc con..."
                  className={`flex-1 text-sm border-none outline-none bg-transparent resize-none ${
                    block.checked ? 'line-through text-gray-500' : 'text-gray-700'
                  }`}
                />
              </div>
            ) : (
              <textarea
                ref={(el) => {
                  if (el) inputRefs.current[block.id] = el;
                }}
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, block.id)}
                onFocus={() => setFocusedBlockId(block.id)}
                onBlur={() => setFocusedBlockId(null)}
                placeholder={index === 0 ? placeholder : "Tiếp tục viết..."}
                className="w-full text-sm border-none outline-none bg-transparent resize-none min-h-[24px]"
                rows={1}
                style={{ height: 'auto' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />
            )}
          </div>

          {/* Delete button */}
          {value.length > 1 && focusedBlockId === block.id && (
            <button
              onClick={() => deleteBlock(block.id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ))}

      {/* Add checklist item button */}
      <button
        onClick={addChecklistItem}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-mind-list-primary-blue transition-colors p-2 hover:bg-gray-50 rounded-lg"
      >
        <CheckSquare size={16} />
        <span>Thêm công việc con</span>
      </button>
    </div>
  );
}