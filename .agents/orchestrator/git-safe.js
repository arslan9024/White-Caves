#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function git(...args) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 30000,
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
  }).trim();
}

function requireIdleCheckout() {
  for (const name of [
    'MERGE_HEAD',
    'CHERRY_PICK_HEAD',
    'REVERT_HEAD',
    'rebase-merge',
    'rebase-apply',
    'sequencer',
  ]) {
    if (fs.existsSync(git('rev-parse', '--git-path', name))) {
      throw new Error(`Finish the active Git operation (${name}) before continuing.`);
    }
  }
  const index = git('rev-parse', '--git-path', 'index');
  if (fs.existsSync(`${index}.lock`)) throw new Error('Git index is locked; no lock was removed.');
}

function fetchMain() {
  git('fetch', '--no-tags', 'origin', 'refs/heads/main:refs/remotes/origin/main');
}

function requireCleanCheckout() {
  if (git('status', '--porcelain=v1', '--untracked-files=all')) {
    throw new Error(
      'Checkout has staged, unstaged, or untracked work. Save and review it first; nothing was stashed.'
    );
  }
}

function requireIntegrated(ref) {
  const remaining = git('rev-list', '--count', ref, '--not', 'refs/remotes/origin/main');
  if (remaining !== '0') {
    throw new Error(
      `${ref} is not fully integrated into fresh origin/main. Retain the branch (including squash/rebase uncertainty).`
    );
  }
}

function main() {
  const [command = 'check', ...args] = process.argv.slice(2);
  if (!['check', 'start', 'retire-check'].includes(command)) {
    throw new Error(
      'Usage: git:safe -- check | start <wave> <agent> <platform> <dev|staging|prod> <task> | retire-check <branch>'
    );
  }
  const root = git('rev-parse', '--show-toplevel');
  process.chdir(path.resolve(root));
  requireIdleCheckout();

  if (command === 'start') {
    const [wave, agent, platform, environment, task] = args;
    if (
      args.length !== 5 ||
      !/^[1-9]\d*$/.test(wave) ||
      ![agent, platform, task].every(value => /^[a-z][a-z0-9-]*$/.test(value)) ||
      !['dev', 'staging', 'prod'].includes(environment)
    ) {
      throw new Error('Supply wave, lowercase agent/platform/task slugs, and dev|staging|prod.');
    }
    requireCleanCheckout();
    git('symbolic-ref', '--quiet', '--short', 'HEAD');
    fetchMain();
    requireCleanCheckout();
    const branch = `copilot/wave-${wave}-${agent}-${platform}-${environment}-${task}`;
    git('switch', '-c', branch);
    console.log(`Created ${branch} from the current HEAD; no commits were reset or pushed.`);
    return;
  }

  if (command === 'retire-check') {
    const [branch] = args;
    if (args.length !== 1 || !branch.startsWith('copilot/wave-')) {
      throw new Error(
        'Specify one copilot/wave-* feature branch; protected branches are not eligible.'
      );
    }
    git('check-ref-format', '--branch', branch);
    requireCleanCheckout();
    fetchMain();
    const local = `refs/heads/${branch}`;
    git('rev-parse', '--verify', local);
    requireIntegrated(local);
    const remote = git('ls-remote', '--heads', 'origin', `refs/heads/${branch}`);
    if (remote) {
      const sha = remote.split(/\s+/)[0];
      git('fetch', '--no-tags', 'origin', `refs/heads/${branch}`);
      if (git('rev-parse', 'FETCH_HEAD') !== sha) {
        throw new Error('Remote branch changed during verification. Retain it and retry.');
      }
      requireIntegrated(sha);
    }
    console.log(`${branch} is integrated into freshly fetched origin/main. No branch was deleted.`);
    return;
  }

  if (args.length) throw new Error('check takes no arguments.');
  fetchMain();
  console.log(git('status', '--short', '--branch'));
  console.log(
    `Behind/ahead origin/main: ${git('rev-list', '--left-right', '--count', 'refs/remotes/origin/main...HEAD')}`
  );
  console.log(
    'Read-only assessment: no stage, commit, push, merge, reset, stash, or deletion performed.'
  );
}

try {
  main();
} catch (error) {
  console.error(`[git-safe] ${error.message}`);
  process.exitCode = 1;
}
