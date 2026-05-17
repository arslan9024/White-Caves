import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import './BulkStatusModal.css';

const BulkTagModal = ({
  isOpen,
  propertyCount,
  onConfirm,
  onCancel,
}) => {
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    if (tags.length > 0) {
      onConfirm(tags);
      setTags([]);
      setTagInput('');
    }
  };

  const handleCancel = () => {
    setTags([]);
    setTagInput('');
    onCancel();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="bulk-tag-modal">
        <div className="modal-header">
          <h2>Add Tags to Properties</h2>
          <button className="modal-close" onClick={handleCancel}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            You are adding tags to <strong>{propertyCount}</strong> properties.
            Enter tags separated by pressing Enter:
          </p>

          <div className="tag-input-wrapper">
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Enter a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                className="btn-confirm"
                onClick={handleAddTag}
                style={{ padding: '10px 15px', width: 'auto' }}
              >
                <Plus size={16} />
              </button>
            </div>

            {tags.length > 0 && (
              <div className="tag-list">
                {tags.map((tag, index) => (
                  <div key={index} className="tag-item">
                    <span>{tag}</span>
                    <button onClick={() => handleRemoveTag(index)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button
            className="btn-confirm"
            onClick={handleConfirm}
            disabled={tags.length === 0}
          >
            Add {tags.length > 0 ? `${tags.length}` : ''} Tag(s)
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkTagModal;
