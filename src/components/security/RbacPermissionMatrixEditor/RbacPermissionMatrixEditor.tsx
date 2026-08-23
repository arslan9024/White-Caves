/**
 * RbacPermissionMatrixEditor — Wave 55 GOAL-094
 * Role-Based Access Control (RBAC) granular permission matrix editor
 * White Caves Real Estate LLC — Security Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`width:100%;background:linear-gradient(135deg,#0F172A,#1E293B);border:2px solid rgba(239,68,68,0.22);border-radius:18px;overflow:hidden;font-family:'Inter',sans-serif;animation:${fadeIn} 0.4s ease;`;
const Head = styled.div`padding:14px 20px;background:rgba(239,68,68,0.05);border-bottom:1px solid rgba(239,68,68,0.12);display:flex;align-items:center;justify-content:space-between;`;
const Title = styled.h3`margin:0;color:#FFF;font-size:0.9rem;font-weight:700;`;
const Body = styled.div`padding:20px;display:flex;flex-direction:column;gap:14px;`;

const RoleTabs = styled.div`display:flex;gap:6px;flex-wrap:wrap;`;
const RoleTab = styled.button<{$active:boolean;$color:string}>`padding:5px 14px;border-radius:20px;font-size:0.72rem;font-weight:700;cursor:pointer;transition:all 0.2s ease;border:${p=>p.$active?'none':'1px solid rgba(100,116,139,0.25)'};background:${p=>p.$active?p.$color:'transparent'};color:${p=>p.$active?'#FFF':'#94A3B8'};&:hover{border-color:${p=>p.$color};}`;

const MatrixTable = styled.div`overflow-x:auto;`;
const Grid = styled.table`width:100%;border-collapse:collapse;font-size:0.72rem;min-width:500px;`;
const Th = styled.th`text-align:left;padding:8px 10px;color:#64748B;font-weight:700;text-transform:uppercase;font-size:0.62rem;letter-spacing:0.04em;border-bottom:1px solid rgba(100,116,139,0.15);white-space:nowrap;`;
const ThCenter = styled(Th)`text-align:center;`;
const Td = styled.td`padding:7px 10px;border-bottom:1px solid rgba(100,116,139,0.08);color:#CBD5E1;`;
const TdCenter = styled(Td)`text-align:center;`;

const Check = styled.button<{$on:boolean;$locked:boolean}>`width:22px;height:22px;border-radius:5px;border:1.5px solid ${p=>p.$on?'rgba(16,185,129,0.5)':'rgba(100,116,139,0.25)'};background:${p=>p.$on?'rgba(16,185,129,0.15)':'rgba(15,23,42,0.5)'};color:${p=>p.$on?'#10B981':'#334155'};font-size:0.75rem;cursor:${p=>p.$locked?'not-allowed':'pointer'};transition:all 0.15s ease;&:hover:not([disabled]){border-color:${p=>p.$on?'rgba(16,185,129,0.8)':'rgba(239,68,68,0.4)'};}`;

const SaveBtn = styled.button`padding:10px 24px;border-radius:10px;border:none;background:linear-gradient(90deg,#DC2626,#EF4444);color:#FFF;font-size:0.82rem;font-weight:800;cursor:pointer;&:hover{filter:brightness(1.1);}`;
const SaveDone = styled.div`padding:10px 24px;border-radius:10px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);color:#10B981;font-size:0.82rem;font-weight:700;text-align:center;`;

const ROLES = [
  { id:'md', label:'MD / L5', color:'#EF4444', locked:true },
  { id:'manager', label:'Manager', color:'#8B5CF6', locked:false },
  { id:'senior_agent', label:'Sr. Agent', color:'#3B82F6', locked:false },
  { id:'agent', label:'Agent', color:'#10B981', locked:false },
  { id:'viewer', label:'Viewer', color:'#64748B', locked:false },
];

const PERMISSIONS = [
  { module:'Properties', actions:['View','Create','Edit','Delete','Publish'] },
  { module:'Leads / CRM', actions:['View','Assign','Edit','Delete','Export'] },
  { module:'Financials', actions:['View','Edit','Approve','Void'] },
  { module:'Reports', actions:['View','Generate','Export'] },
  { module:'Users', actions:['View','Invite','Edit Role','Delete'] },
  { module:'Compliance', actions:['View','Submit','Approve'] },
  { module:'Settings', actions:['View','Edit'] },
];

type Matrix = Record<string, Record<string, boolean>>;

function buildDefaultMatrix(): Matrix {
  const matrix: Matrix = {};
  for (const role of ROLES) {
    matrix[role.id] = {};
    for (const mod of PERMISSIONS) {
      for (const action of mod.actions) {
        const key = `${mod.module}::${action}`;
        if (role.id === 'md') { matrix[role.id][key] = true; continue; }
        if (role.id === 'viewer') { matrix[role.id][key] = action === 'View' || action === 'Generate'; continue; }
        if (role.id === 'agent') {
          matrix[role.id][key] = ['View','Create','Edit'].includes(action) && ['Properties','Leads / CRM'].includes(mod.module);
          continue;
        }
        if (role.id === 'senior_agent') {
          matrix[role.id][key] = !['Delete','Void','Delete'].includes(action) || !['Financials','Users'].includes(mod.module);
          continue;
        }
        matrix[role.id][key] = action !== 'Delete' || !['Users','Financials'].includes(mod.module);
      }
    }
  }
  return matrix;
}

export const RbacPermissionMatrixEditor: FC = () => {
  const [activeRole, setActiveRole] = useState('manager');
  const [matrix, setMatrix] = useState<Matrix>(buildDefaultMatrix);
  const [saved, setSaved] = useState(false);

  const toggle = (roleId: string, mod: string, action: string) => {
    if (ROLES.find(r=>r.id===roleId)?.locked) return;
    const key = `${mod}::${action}`;
    setMatrix(prev=>({ ...prev, [roleId]:{ ...prev[roleId], [key]:!prev[roleId][key] } }));
    setSaved(false);
  };

  const role = ROLES.find(r=>r.id===activeRole)!;
  const totalGranted = Object.values(matrix[activeRole]||{}).filter(Boolean).length;

  return (
    <Wrap data-testid="rbac-permission-matrix-editor">
      <Head>
        <Title>🛡️ RBAC Permission Matrix</Title>
        <div style={{fontSize:'0.68rem',color:'var(--accent-red, #EF4444)',fontWeight:700}}>{totalGranted} permissions granted</div>
      </Head>
      <Body>
        <RoleTabs>
          {ROLES.map(r=>(
            <RoleTab key={r.id} $active={activeRole===r.id} $color={r.color} onClick={()=>setActiveRole(r.id)}>
              {r.id==='md'?'👑 ':''}{r.label}
            </RoleTab>
          ))}
        </RoleTabs>

        <MatrixTable>
          <Grid>
            <thead>
              <tr>
                <Th>Module</Th>
                {/* gather all unique actions for selected perms */}
                {Array.from(new Set(PERMISSIONS.flatMap(m=>m.actions))).slice(0,5).map(a=><ThCenter key={a}>{a}</ThCenter>)}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map(mod=>(
                <tr key={mod.module}>
                  <Td style={{fontWeight:700,color:'var(--color-94a3b8, #94A3B8)'}}>{mod.module}</Td>
                  {Array.from(new Set(PERMISSIONS.flatMap(m=>m.actions))).slice(0,5).map(action=>{
                    const key = `${mod.module}::${action}`;
                    const supported = mod.actions.includes(action);
                    const isOn = supported && (matrix[activeRole]?.[key] ?? false);
                    return (
                      <TdCenter key={action}>
                        {supported ? (
                          <Check
                            $on={isOn}
                            $locked={role.locked}
                            onClick={()=>toggle(activeRole, mod.module, action)}
                            title={`${isOn?'Revoke':'Grant'} ${action} on ${mod.module}`}
                            disabled={role.locked}
                          >
                            {isOn?'✓':''}
                          </Check>
                        ) : <span style={{color:'var(--color-1e293b, #1E293B)'}}>—</span>}
                      </TdCenter>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Grid>
        </MatrixTable>

        {role.locked ? (
          <div style={{fontSize:'0.72rem',color:'var(--text-secondary, #64748B)',textAlign:'center',padding:'8px'}}>
            🔒 MD (Level 5) permissions are immutable — full access to all modules
          </div>
        ) : saved ? (
          <SaveDone>✅ Permissions saved for {role.label}</SaveDone>
        ) : (
          <SaveBtn onClick={()=>setSaved(true)}>💾 Save {role.label} Permissions</SaveBtn>
        )}
      </Body>
    </Wrap>
  );
};

export default RbacPermissionMatrixEditor;
