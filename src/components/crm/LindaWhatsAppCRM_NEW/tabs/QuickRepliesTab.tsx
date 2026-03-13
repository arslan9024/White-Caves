import React from 'react';
import { MessageSquare, Plus, Edit2, Trash2, Copy, Clock } from 'lucide-react';

export const QuickRepliesTab = ({ data }) => {
  const { quickReplies } = data;

  return (
    <div className="quick-replies-tab">
      <div className="tab-header">
        <h3>Quick Replies</h3>
        <button className="add-btn">
          <Plus size={18} /> Add Reply
        </button>
      </div>

      <div className="quick-replies-list">
        {quickReplies.map(reply => (
          <div key={reply.id} className="reply-card">
            <div className="reply-header">
              <MessageSquare size={16} />
              <span className="reply-id">Reply #{reply.id}</span>
              <div className="reply-time">
                <Clock size={14} />
              </div>
            </div>
            <p className="reply-text">{reply.text}</p>
            <div className="reply-actions">
              <button className="action-btn" title="Copy"><Copy size={16} /></button>
              <button className="action-btn" title="Edit"><Edit2 size={16} /></button>
              <button className="action-btn delete" title="Delete"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
