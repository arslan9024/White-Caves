import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;font-family:'Inter',sans-serif;animation:${fadeIn} .4s ease;background:rgba(15,23,42,0.9);border:1px dashed rgba(100,116,139,0.4);border-radius:18px;overflow:hidden;padding:32px;text-align:center`;
const Title = styled.h2`margin:0 0 8px;font-size:1.2rem;font-weight:800;color:#E2E8F0`;
const Sub = styled.div`font-size:.8rem;color:#94A3B8;margin-bottom:24px`;

const DropZone = styled.div<{$drag:boolean}>`border:2px dashed ${p=>p.$drag?'#38BDF8':'rgba(100,116,139,0.3)'};background:${p=>p.$drag?'rgba(56,189,248,0.1)':'rgba(30,41,59,0.5)'};border-radius:16px;padding:40px;cursor:pointer;transition:all .2s`;
const Icon = styled.div`font-size:3rem;margin-bottom:16px`;
const DropText = styled.div`font-size:.9rem;font-weight:700;color:#E2E8F0`;

export const EjariContractUploader: FC = () => {
  const [drag, setDrag] = useState(false);

  return (
    <Wrap data-testid="ejari-contract-uploader">
      <Title>📄 Upload Registered Ejari Contract</Title>
      <Sub>Upload the final Ejari certificate PDF to activate the tenancy and unlock rent payment schedules.</Sub>
      
      <DropZone 
        $drag={drag}
        onDragOver={e=>{e.preventDefault();setDrag(true)}}
        onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false)}}
      >
        <Icon>📄</Icon>
        <DropText>Drag & Drop Ejari PDF Here</DropText>
        <Sub style={{marginTop:8,marginBottom:0}}>or click to browse files</Sub>
      </DropZone>
    </Wrap>
  );
};
export default EjariContractUploader;
