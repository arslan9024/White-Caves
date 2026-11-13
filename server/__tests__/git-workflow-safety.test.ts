// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const scripts = path.resolve('.agents', 'orchestrator');
let fixture: string;
let checkout: string;
let remote: string;

function git(...args: string[]): string {
  return execFileSync('git', args, { cwd: checkout, encoding: 'utf8', stdio: 'pipe' }).trim();
}

function run(...args: string[]) {
  return spawnSync(process.execPath, [path.join(scripts, 'git-safe.js'), ...args], {
    cwd: checkout,
    encoding: 'utf8',
    timeout: 30000,
  });
}

beforeEach(() => {
  fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'white-caves-git-safety-'));
  checkout = path.join(fixture, 'checkout');
  remote = path.join(fixture, 'remote.git');
  fs.mkdirSync(checkout);
  git('init', '--bare', remote);
  git('init', '-b', 'main');
  git('config', 'user.name', 'Git safety fixture');
  git('config', 'user.email', 'fixture@example.invalid');
  git('config', 'commit.gpgsign', 'false');
  fs.writeFileSync(path.join(checkout, 'work.txt'), 'original\n');
  git('add', '--', 'work.txt');
  git('commit', '-m', 'test: initial fixture');
  git('remote', 'add', 'origin', remote);
  git('push', '-u', 'origin', 'main');
});

afterEach(() => {
  fs.rmSync(fixture, { recursive: true, force: true });
});

describe('explicit branch workflow', () => {
  it('assesses divergence without changing HEAD, index, or the remote', () => {
    git('switch', '-c', 'copilot/wave-56-copilot-vscode-dev-test');
    fs.writeFileSync(path.join(checkout, 'work.txt'), 'staged\n');
    git('add', '--', 'work.txt');
    const head = git('rev-parse', 'HEAD');
    const index = git('diff', '--cached');
    const remoteBefore = git('ls-remote', '--heads', 'origin');
    const result = run('check');
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Behind/ahead origin/main: 0');
    expect(git('rev-parse', 'HEAD')).toBe(head);
    expect(git('diff', '--cached')).toBe(index);
    expect(git('ls-remote', '--heads', 'origin')).toBe(remoteBefore);
  });

  it('creates a fully identified branch from HEAD and never resets an existing branch', () => {
    const head = git('rev-parse', 'HEAD');
    const args = ['start', '56', 'copilot', 'vscode', 'dev', 'git-safety'];
    expect(run(...args).status).toBe(0);
    expect(git('branch', '--show-current')).toBe('copilot/wave-56-copilot-vscode-dev-git-safety');
    expect(git('rev-parse', 'HEAD')).toBe(head);
    expect(run(...args).status).not.toBe(0);
    expect(git('rev-parse', 'HEAD')).toBe(head);
  });

  it.each(['staged', 'unstaged', 'untracked'])('refuses to switch with %s work', state => {
    const file = state === 'untracked' ? 'new.txt' : 'work.txt';
    fs.writeFileSync(path.join(checkout, file), 'preserve me\n');
    if (state === 'staged') git('add', '--', file);
    const status = git('status', '--porcelain=v1');
    const result = run('start', '56', 'copilot', 'vscode', 'dev', 'test');
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('nothing was stashed');
    expect(git('branch', '--show-current')).toBe('main');
    expect(git('status', '--porcelain=v1')).toBe(status);
    expect(fs.readFileSync(path.join(checkout, file), 'utf8')).toBe('preserve me\n');
  });

  it('blocks invalid identities and unfinished Git operations', () => {
    expect(run('start', '56', 'copilot', 'vscode', 'production', 'test').status).not.toBe(0);
    fs.writeFileSync(path.join(checkout, '.git', 'MERGE_HEAD'), git('rev-parse', 'HEAD'));
    const result = run('start', '56', 'copilot', 'vscode', 'dev', 'test');
    expect(result.stderr).toContain('Finish the active Git operation');
    expect(git('branch', '--show-current')).toBe('main');
  });

  it('retains a branch saved remotely but not integrated into remote main', () => {
    const branch = 'copilot/wave-56-copilot-vscode-dev-test';
    git('switch', '-c', branch);
    fs.writeFileSync(path.join(checkout, 'work.txt'), 'feature\n');
    git('commit', '-am', 'test: unique feature');
    git('push', '-u', 'origin', branch);
    const result = run('retire-check', branch);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('Retain the branch');
    expect(git('show', `${branch}:work.txt`)).toBe('feature');
    git('push', 'origin', 'HEAD:main');
    expect(run('retire-check', branch).status).toBe(0);
    expect(git('branch', '--list', branch)).toContain(branch);
    expect(git('ls-remote', '--heads', 'origin', branch)).toContain(branch);
  });

  it('also retains a remote branch with additional unmerged work', () => {
    const branch = 'copilot/wave-56-copilot-vscode-dev-test';
    git('switch', '-c', branch);
    fs.writeFileSync(path.join(checkout, 'work.txt'), 'remote feature\n');
    git('commit', '-am', 'test: remote-only feature');
    git('push', 'origin', `HEAD:${branch}`);
    git('switch', 'main');
    git('branch', `${branch}-local`, 'main');
    git('push', 'origin', `${branch}:refs/heads/${branch}-local`);
    const result = run('retire-check', `${branch}-local`);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('Retain the branch');
  });

  it('fails closed when the remote cannot be verified', () => {
    git('remote', 'set-url', 'origin', path.join(fixture, 'missing.git'));
    expect(run('retire-check', 'copilot/wave-56-copilot-vscode-dev-test').status).not.toBe(0);
    expect(run('start', '56', 'copilot', 'vscode', 'dev', 'test').status).not.toBe(0);
    expect(git('branch', '--show-current')).toBe('main');
  });
});

describe('quarantined legacy writers', () => {
  it.each(['gitWorkflow', 'gitPush', 'autoMerge'])(
    'rejects tri-turn %s before processing',
    option => {
      // Isolate validation from the legacy runner's unresolved optional imports.
      const source = ts.createSourceFile(
        'autopilot.js',
        fs.readFileSync(path.join(scripts, 'tri-turn-sovereign-autopilot.js'), 'utf8'),
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.JS
      );
      const declaration = source.statements.find(
        node => ts.isFunctionDeclaration(node) && node.name?.text === 'validateOptions'
      );
      if (!declaration) throw new Error('Missing tri-turn validation function');
      const validate = vm.runInNewContext(`(${declaration.getText(source)})`) as (
        options: Record<string, boolean>
      ) => void;
      expect(() => validate({ [option]: true })).toThrow('Automatic Git writes disabled');
      expect(git('status', '--porcelain=v1')).toBe('');
    }
  );

  it.skipIf(process.platform !== 'win32')(
    'blocks restart sync without running pull or push',
    () => {
      const file = path.join(scripts, 'ten-task-loop.ps1').replaceAll("'", "''");
      const result = spawnSync(
        'powershell.exe',
        [
          '-NoProfile',
          '-Command',
          `
      $ast = [System.Management.Automation.Language.Parser]::ParseFile('${file}', [ref]$null, [ref]$null)
      $fn = $ast.Find({ param($n) $n -is [System.Management.Automation.Language.FunctionDefinitionAst] -and $n.Name -eq 'Invoke-GitSyncBeforeRestart' }, $true)
      if (-not $fn) { throw 'Missing restart sync function' }
      Invoke-Expression $fn.Extent.Text
      function Write-ActivityLog { param($Stage, $Message, $Color) Write-Host $Message }
      function Get-RunSummary { throw 'Git command must not execute' }
      if ((Invoke-GitSyncBeforeRestart -Branch 'main') -ne $false) { throw 'Restart must be blocked' }
    `,
        ],
        { cwd: checkout, encoding: 'utf8', timeout: 15000 }
      );
      expect(result.error).toBeUndefined();
      expect(result.status).toBe(0);
      expect(result.stdout).toContain('Automatic pull/push disabled');
      expect(git('status', '--porcelain=v1')).toBe('');
    }
  );

  for (const script of [
    'aegis-cycle.js',
    'aegis-nova-v2-engine.cjs',
    'aegis-fast-five.ps1',
    'session-end.ps1',
    'loop-start-sync.ps1',
    'tracker-commit-when-free.ps1',
  ]) {
    it.skipIf(script.endsWith('.ps1') && process.platform !== 'win32')(
      `${script} refuses execution without changing work or the index`,
      () => {
        fs.writeFileSync(path.join(checkout, 'work.txt'), 'staged work\n');
        git('add', '--', 'work.txt');
        const before = git('diff', '--cached');
        const head = git('rev-parse', 'HEAD');
        const ps = script.endsWith('.ps1');
        const result = spawnSync(
          ps ? (process.platform === 'win32' ? 'powershell.exe' : 'pwsh') : process.execPath,
          ps ? ['-NoProfile', '-File', path.join(scripts, script)] : [path.join(scripts, script)],
          { cwd: checkout, encoding: 'utf8', timeout: 15000 }
        );
        expect(result.error).toBeUndefined();
        expect(result.status).not.toBe(0);
        expect(result.stdout + result.stderr).toContain('Legacy automatic Git workflow disabled');
        expect(git('diff', '--cached')).toBe(before);
        expect(git('rev-parse', 'HEAD')).toBe(head);
        expect(git('branch', '--show-current')).toBe('main');
        expect(git('status', '--porcelain=v1')).toBe('M  work.txt');
      }
    );
  }
});
