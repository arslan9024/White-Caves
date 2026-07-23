const fs = require('fs');
const path = require('path');

const md = fs.readFileSync('strategies/DEPARTMENT_ROLES_RBAC.md', 'utf-8');

// Regex for departments block
const regex = /## \d+\. (.+?) \((.+?)\)[\s\S]*?(?=(?:## \d+\.|\n## 🤖|$))/g;

const roles = [];

let match;
while ((match = regex.exec(md)) !== null) {
  const deptName = match[1].trim();
  const deptId = match[2].trim();
  const block = match[0];
  
  const roleRegex = /\d+\.\s+([A-Z]+-\d+)\s+\((.+?)\)\s+•\s+(.+?):/g;
  let roleMatch;
  while ((roleMatch = roleRegex.exec(block)) !== null) {
    const roleId = roleMatch[1].trim();
    const tier = roleMatch[2].trim();
    const title = roleMatch[3].trim();
    
    let accessLevel = 'AccessLevel.LEVEL_2_RESTRICTED';
    if (roleId === 'EXE-001') {
      accessLevel = 'AccessLevel.LEVEL_5_MASTER';
    } else if (tier === 'Executive') {
      accessLevel = 'AccessLevel.LEVEL_4_DEPARTMENT_HEAD';
    } else if (tier === 'Senior') {
      accessLevel = 'AccessLevel.LEVEL_3_POWER';
    } else if (tier === 'Mid' || tier === 'Junior') {
      accessLevel = 'AccessLevel.LEVEL_2_RESTRICTED';
    } else if (tier === 'Intern') {
      accessLevel = 'AccessLevel.LEVEL_1_READ';
    }

    roles.push({
      roleId,
      departmentId: deptId,
      title,
      tier,
      defaultAccessLevel: accessLevel
    });
  }
}

// Extract AI
const aiBlockRegex = /## 🤖 Core AI Assistants[\s\S]*?(?=\n-|$)/;
const aiBlock = aiBlockRegex.exec(md);
if (aiBlock) {
  const aiRegex = /\d+\.\s+(AI-[A-Z]+)\s+\((.+?)\)\s+•\s+(.+?):/g;
  let aiMatch;
  while ((aiMatch = aiRegex.exec(aiBlock[0])) !== null) {
    roles.push({
      roleId: aiMatch[1].trim(),
      departmentId: 'ai', // default to ai
      title: aiMatch[3].trim(),
      tier: 'AI',
      defaultAccessLevel: 'AccessLevel.LEVEL_4_DEPARTMENT_HEAD'
    });
  }
}

let code = `import { Request, Response, NextFunction } from 'express';

export enum AccessLevel {
  LEVEL_1_READ = 1,
  LEVEL_2_RESTRICTED = 2,
  LEVEL_3_POWER = 3,
  LEVEL_4_DEPARTMENT_HEAD = 4,
  LEVEL_5_MASTER = 5,
}

export type Tier = 'Executive' | 'Senior' | 'Mid' | 'Junior' | 'Intern' | 'AI';

export interface JobRole {
  roleId: string;
  departmentId: string;
  title: string;
  tier: Tier;
  defaultAccessLevel: AccessLevel;
}

export const WHITE_CAVES_ROLES: JobRole[] = [
${roles.map(r => `  {
    roleId: "${r.roleId}",
    departmentId: "${r.departmentId}",
    title: "${r.title}",
    tier: "${r.tier}",
    defaultAccessLevel: ${r.defaultAccessLevel}
  }`).join(',\n')}
];

export const enforceAccessGating = (requiredLevel: AccessLevel) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Extract user from hydration session context
      const user = (req as any).user;
      
      if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Check Lion override
      if (user.email === 'arslanmalikgoraha@gmail.com' && user.role === 'managing_director') {
        (req as any).accessLevel = AccessLevel.LEVEL_5_MASTER;
        next();
        return;
      }

      const userRole = WHITE_CAVES_ROLES.find(r => r.roleId === user.roleId);
      
      if (!userRole) {
        res.status(403).json({ error: 'Forbidden: Role not found' });
        return;
      }

      if (userRole.defaultAccessLevel < requiredLevel) {
        res.status(403).json({ error: 'Forbidden: Insufficient access level' });
        return;
      }

      (req as any).accessLevel = userRole.defaultAccessLevel;
      next();
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
  };
};
`;

const configDir = path.join('src', 'config');
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

fs.writeFileSync(path.join(configDir, 'rbacConfiguration.ts'), code);
console.log('Successfully wrote ' + roles.length + ' roles to src/config/rbacConfiguration.ts');
