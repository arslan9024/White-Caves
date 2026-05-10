import React, { useState } from 'react';
import styled from 'styled-components';
import type { ScheduledMessage } from '../../../types/phase6.types';

interface MessageSchedulerProps {
  onScheduleMessage: (message: Omit<ScheduledMessage, 'id' | 'status'>) => Promise<void>;
  defaultRecipients?: string[];
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 14px;
  color: #333;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RecipientList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RecipientChip = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: #e8f5e9;
  border: 1px solid #4caf50;
  border-radius: 20px;
  font-size: 13px;
  color: #2e7d32;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #2e7d32;
  cursor: pointer;
  padding: 0 4px;
  font-weight: bold;

  &:hover {
    opacity: 0.7;
  }
`;

const PreviewContainer = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 16px;
  margin-top: 12px;
`;

const PreviewTitle = styled.h4`
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const PreviewContent = styled.div`
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 12px;
  font-size: 14px;
  color: #666;
  white-space: pre-wrap;
  word-break: break-word;
`;

const ScheduleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  color: #666;
  padding: 12px;
  background-color: #e8f5e9;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  ${(props) =>
    props.variant === 'primary'
      ? `
    background-color: #4caf50;
    color: white;
    &:hover {
      background-color: #45a049;
    }
  `
      : `
    background-color: #f0f0f0;
    color: #333;
    &:hover {
      background-color: #e0e0e0;
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TimeZoneInfo = styled.p`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
`;

const WarningBox = styled.div`
  background-color: #fff3e0;
  border-left: 4px solid #ff9800;
  padding: 12px;
  border-radius: 4px;
  font-size: 13px;
  color: #e65100;
`;

export const MessageScheduler: React.FC<MessageSchedulerProps> = ({
  onScheduleMessage,
  defaultRecipients = [],
}) => {
  const [content, setContent] = useState('');
  const [recipients, setRecipients] = useState<string[]>(defaultRecipients);
  const [newRecipient, setNewRecipient] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddRecipient = () => {
    if (newRecipient.trim() && !recipients.includes(newRecipient)) {
      setRecipients([...recipients, newRecipient]);
      setNewRecipient('');
    }
  };

  const handleRemoveRecipient = (recipient: string) => {
    setRecipients(recipients.filter((r) => r !== recipient));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddRecipient();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      alert('Please enter a message');
      return;
    }

    if (recipients.length === 0) {
      alert('Please add at least one recipient');
      return;
    }

    if (!scheduledAt) {
      alert('Please select a schedule date/time');
      return;
    }

    const scheduledDate = new Date(scheduledAt);
    const now = new Date();

    if (scheduledDate <= now) {
      alert('Please select a future date and time');
      return;
    }

    setIsSubmitting(true);

    try {
      await onScheduleMessage({
        content,
        recipients,
        scheduledAt: scheduledDate.toISOString(),
        timezone,
      });

      // Reset form
      setContent('');
      setRecipients([]);
      setScheduledAt('');
      alert('Message scheduled successfully!');
    } catch (error) {
      console.error('Failed to schedule message:', error);
      alert('Failed to schedule message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setContent('');
    setRecipients(defaultRecipients);
    setScheduledAt('');
  };

  const minDateTime = new Date().toISOString().slice(0, 16);

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <FormSection>
          <Label>Message Content</Label>
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter the message you want to schedule..."
            disabled={isSubmitting}
          />
        </FormSection>

        <FormSection>
          <Label>Recipients</Label>
          <div>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '12px',
              }}
            >
              <Input
                type="text"
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter recipient (phone number or ID)"
                disabled={isSubmitting}
                style={{ flex: 1 }}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddRecipient}
                disabled={isSubmitting || !newRecipient.trim()}
              >
                Add
              </Button>
            </div>
            {recipients.length > 0 && (
              <RecipientList>
                {recipients.map((recipient) => (
                  <RecipientChip key={recipient}>
                    <span>{recipient}</span>
                    <RemoveButton
                      type="button"
                      onClick={() => handleRemoveRecipient(recipient)}
                    >
                      ✕
                    </RemoveButton>
                  </RecipientChip>
                ))}
              </RecipientList>
            )}
          </div>
        </FormSection>

        <FormSection>
          <Label>Schedule Date & Time</Label>
          <Row>
            <div>
              <Input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                min={minDateTime}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern (US)</option>
                <option value="America/Chicago">Central (US)</option>
                <option value="America/Denver">Mountain (US)</option>
                <option value="America/Los_Angeles">Pacific (US)</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Dubai">Dubai</option>
                <option value="Asia/Tokyo">Tokyo</option>
                <option value="Australia/Sydney">Sydney</option>
              </Select>
              <TimeZoneInfo>Selected: {timezone}</TimeZoneInfo>
            </div>
          </Row>
        </FormSection>

        {scheduledAt && (
          <ScheduleInfo>
            <strong>Scheduled to send:</strong>
            <span>
              {new Date(scheduledAt).toLocaleString('en-US', {
                dateStyle: 'full',
                timeStyle: 'short',
              })}{' '}
              ({timezone})
            </span>
            <span>
              ({Math.round((new Date(scheduledAt).getTime() - new Date().getTime()) / 60000)} minutes
              from now)
            </span>
          </ScheduleInfo>
        )}

        {content && (
          <PreviewContainer>
            <PreviewTitle>Message Preview</PreviewTitle>
            <PreviewContent>{content}</PreviewContent>
          </PreviewContainer>
        )}

        {recipients.length > 0 && (
          <WarningBox>
            💡 This message will be sent to {recipients.length} recipient
            {recipients.length !== 1 ? 's' : ''}. Make sure the details are correct before
            scheduling.
          </WarningBox>
        )}

        <ButtonGroup>
          <Button type="button" variant="secondary" onClick={handleReset} disabled={isSubmitting}>
            Clear
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || !content.trim() || recipients.length === 0 || !scheduledAt}
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule Message'}
          </Button>
        </ButtonGroup>
      </form>
    </Container>
  );
};

export default MessageScheduler;
