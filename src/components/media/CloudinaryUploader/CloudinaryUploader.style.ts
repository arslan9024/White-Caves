import styled from 'styled-components';

export const UploaderWrap = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(100, 116, 139, 0.2);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(12px);
  margin-bottom: 24px;
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #F8FAFC;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Dropzone = styled.div<{ $isDragActive: boolean }>`
  border: 2px dashed ${({ $isDragActive }) => $isDragActive ? '#38BDF8' : 'rgba(100, 116, 139, 0.4)'};
  background: ${({ $isDragActive }) => $isDragActive ? 'rgba(56, 189, 248, 0.05)' : 'rgba(30, 41, 59, 0.3)'};
  border-radius: 8px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #38BDF8;
    background: rgba(56, 189, 248, 0.05);
  }
`;

export const DropzoneText = styled.div`
  color: #94A3B8;
  font-size: 0.95rem;
  text-align: center;
`;

export const UploadList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 24px;
`;

export const UploadItem = styled.div`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(100, 116, 139, 0.2);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const ImagePreview = styled.div`
  height: 120px;
  background: #1E293B;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ItemMeta = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ItemName = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: #E2E8F0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ItemStatus = styled.div`
  font-size: 0.75rem;
  color: #22C55E;
`;
