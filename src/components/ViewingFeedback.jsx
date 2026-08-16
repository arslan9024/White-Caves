import React, { useEffect, useMemo, useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react';
import { authFetch } from '../utils/authFetch';
import { clearDraft, getDraft, setDraft } from '../utils/indexedDraftStore';
import './ViewingFeedback.css';

const ViewingFeedback = ({ viewing, onSubmit, onClose }) => {
  const [outcome, setOutcome] = useState('');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  const draftKey = useMemo(
    () => `viewing-feedback:${viewing?._id || viewing?.id || 'unknown'}`,
    [viewing?._id, viewing?.id]
  );

  useEffect(() => {
    let active = true;

    const loadDraft = async () => {
      try {
        const draft = await getDraft(draftKey);
        if (!active || !draft || typeof draft !== 'object') return;

        if (typeof draft.outcome === 'string') setOutcome(draft.outcome);
        if (typeof draft.feedback === 'string') setFeedback(draft.feedback);
        if (typeof draft.rating === 'number') setRating(draft.rating);
      } catch {
        // Silent fallback: user can still continue without draft restore.
      } finally {
        if (active) setDraftLoaded(true);
      }
    };

    void loadDraft();

    return () => {
      active = false;
    };
  }, [draftKey]);

  useEffect(() => {
    if (!draftLoaded) return;
    void setDraft(draftKey, { outcome, rating, feedback }).catch(() => {
      // Silent fallback: user can still continue without draft autosave.
    });
  }, [draftKey, draftLoaded, feedback, outcome, rating]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await authFetch(`/api/viewings/${viewing._id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outcome,
          feedback,
          rating,
        }),
      });

      if (response.ok) {
        await clearDraft(draftKey);
        setSubmitted(true);
        onSubmit?.();
        setTimeout(() => onClose?.(), 2000);
      }
    } catch (error) {
      
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-form-container">
      {submitted ? (
        <div className="feedback-success">
          <div className="success-icon">✓</div>
          <h3>Thank You!</h3>
          <p>Your feedback has been recorded</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="feedback-form">
          <h3>Viewing Feedback</h3>

          {/* Property Info */}
          {viewing && (
            <div className="viewing-info">
              <h4>{viewing.propertyId?.title || 'Property'}</h4>
              <p>
                {new Date(viewing.scheduledDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}

          {/* Outcome Selection */}
          <div className="form-section">
            <label>
              <span className="section-label">How interested are you?</span>
            </label>
            <div className="outcome-buttons">
              <button
                type="button"
                className={`outcome-btn ${outcome === 'interested' ? 'selected' : ''}`}
                onClick={() => setOutcome('interested')}
              >
                <ThumbsUp size={24} />
                <span>Very Interested</span>
              </button>
              <button
                type="button"
                className={`outcome-btn ${outcome === 'maybe' ? 'selected' : ''}`}
                onClick={() => setOutcome('maybe')}
              >
                <HelpCircle size={24} />
                <span>Maybe</span>
              </button>
              <button
                type="button"
                className={`outcome-btn ${outcome === 'not-interested' ? 'selected' : ''}`}
                onClick={() => setOutcome('not-interested')}
              >
                <ThumbsDown size={24} />
                <span>Not Interested</span>
              </button>
            </div>
          </div>

          {/* Rating */}
          <div className="form-section">
            <label>
              <span className="section-label">How would you rate this property?</span>
            </label>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`star ${rating >= star ? 'filled' : ''}`}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={32}
                    fill={rating >= star ? '#ffc107' : 'none'}
                    color={rating >= star ? '#ffc107' : '#ddd'}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="rating-text">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            )}
          </div>

          {/* Detailed Feedback */}
          <div className="form-section">
            <label htmlFor="feedback">
              <span className="section-label">Additional Comments (Optional)</span>
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Tell us more about your experience... What did you like? What could be improved?"
              rows={4}
              className="feedback-textarea"
            />
          </div>

          {/* Questions */}
          <div className="feedback-questions">
            <h4>Quick Questions</h4>

            <div className="question">
              <label>
                <input type="checkbox" defaultChecked />
                Was the property in good condition?
              </label>
            </div>

            <div className="question">
              <label>
                <input type="checkbox" defaultChecked />
                Was the agent professional and helpful?
              </label>
            </div>

            <div className="question">
              <label>
                <input type="checkbox" defaultChecked />
                Would you like a follow-up viewing?
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Skip
            </button>
            <button type="submit" className="btn-submit" disabled={!outcome || submitting}>
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ViewingFeedback;
