/**
 * WhatsApp Dashboard Page
 *
 * Main page for WhatsApp integration
 * Integrates AccountLink, ChatInterface, ConversationList, and Analytics
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { AccountLink } from '../../components/WhatsApp/AccountLink';
import { ConversationList } from '../../components/WhatsApp/ChatInterface/ConversationList';
import { ChatInterface } from '../../components/WhatsApp/ChatInterface';
import { Analytics } from '../../components/WhatsApp/Analytics';
import { useWhatsAppIntegration } from '../../hooks/whatsapp';

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #f5f5f5;
`;

const Sidebar = styled.div`
  width: 80px;
  background: #fff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  gap: 12px;
`;

const NavButton = styled.button<{ active?: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: ${props => (props.active ? '#25d366' : '#f0f0f0')};
  color: ${props => (props.active ? 'white' : '#666')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => (props.active ? '#20ba5a' : '#e0e0e0')};
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  background: #fff;
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
`;

const LoadingSpinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #25d366;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

type ViewType = 'chat' | 'analytics' | 'settings' | 'account';

interface SelectedConversation {
  conversationId: string;
  recipientNumber: string;
  recipientName: string;
}

export const WhatsAppDashboard: React.FC = () => {
  const { accounts, currentAccount, isLoading } = useWhatsAppIntegration();
  const [currentView, setCurrentView] = useState<ViewType>('chat');
  const [selectedConversation, setSelectedConversation] = useState<SelectedConversation | null>(
    null
  );
  const [showAccountLink, setShowAccountLink] = useState(accounts.length === 0);

  if (isLoading && !currentAccount) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </Container>
    );
  }

  if (!currentAccount || showAccountLink) {
    return <AccountLink onSuccess={() => setShowAccountLink(false)} />;
  }

  return (
    <Container>
      <Sidebar>
        <NavButton
          active={currentView === 'chat'}
          onClick={() => setCurrentView('chat')}
          title="Messages"
        >
          💬
        </NavButton>

        <NavButton
          active={currentView === 'analytics'}
          onClick={() => setCurrentView('analytics')}
          title="Analytics"
        >
          📊
        </NavButton>

        <NavButton
          active={currentView === 'settings'}
          onClick={() => setCurrentView('settings')}
          title="Settings"
        >
          ⚙️
        </NavButton>

        <NavButton
          active={currentView === 'account'}
          onClick={() => setCurrentView('account')}
          title="Account"
        >
          👤
        </NavButton>
      </Sidebar>

      <MainContent>
        {currentView === 'chat' && (
          <ChatContainer>
            <ConversationList
              accountId={currentAccount.accountId}
              selectedConversationId={selectedConversation?.conversationId}
              onSelectConversation={(conversationId, recipientNumber, name) =>
                setSelectedConversation({ conversationId, recipientNumber, recipientName: name })
              }
            />
            <ContentArea>
              {selectedConversation ? (
                <ChatInterface
                  accountId={currentAccount.accountId}
                  conversationId={selectedConversation.conversationId}
                  recipientNumber={selectedConversation.recipientNumber}
                  recipientName={selectedConversation.recipientName}
                  onBack={() => setSelectedConversation(null)}
                />
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#999',
                    fontSize: '16px',
                  }}
                >
                  Select a conversation to start messaging
                </div>
              )}
            </ContentArea>
          </ChatContainer>
        )}

        {currentView === 'analytics' && (
          <ContentArea>
            <Analytics accountId={currentAccount.accountId} />
          </ContentArea>
        )}

        {currentView === 'settings' && (
          <ContentArea>
            <div
              style={{
                padding: '24px',
                color: '#999',
              }}
            >
              <h2>Settings</h2>
              <p>Account Settings Coming Soon</p>
            </div>
          </ContentArea>
        )}

        {currentView === 'account' && (
          <ContentArea>
            <div
              style={{
                padding: '24px',
              }}
            >
              <h2>Account Information</h2>
              <div
                style={{
                  background: '#f5f5f5',
                  padding: '16px',
                  borderRadius: '8px',
                }}
              >
                <p>
                  <strong>Name:</strong>{' '}
                  {currentAccount.accountId || currentAccount.phoneNumber || 'Unnamed'}
                </p>
                <p>
                  <strong>Business Name:</strong> {'N/A'}
                </p>
                <p>
                  <strong>Phone:</strong> {currentAccount.phoneNumber || 'N/A'}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    style={{
                      color: currentAccount.status === 'connected' ? '#25d366' : '#f44336',
                    }}
                  >
                    {currentAccount.status === 'connected' ? 'Connected' : 'Disconnected'}
                  </span>
                </p>
              </div>
            </div>
          </ContentArea>
        )}
      </MainContent>
    </Container>
  );
};
