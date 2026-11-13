// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import {
  enforceRootHygiene,
  parseOptions,
  runPerpetualLoop,
} from '../../.agents/orchestrator/aegis-perpetual-ouroboros.js';

vi.mock('node:child_process', () => ({ execSync: vi.fn() }));
vi.mock('node:fs', () => ({
  default: {
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
    openSync: vi.fn(),
    writeFileSync: vi.fn(),
    appendFileSync: vi.fn(),
    closeSync: vi.fn(),
    unlinkSync: vi.fn(),
  },
}));

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(fs.existsSync).mockReturnValue(false);
  vi.mocked(fs.openSync).mockReturnValue(17);
});

describe('bounded automation', () => {
  it('stops after the explicitly requested number of successful cycles', async () => {
    vi.useFakeTimers();
    try {
      const finished = runPerpetualLoop(parseOptions(['--cycles', '2']));
      await vi.runAllTimersAsync();
      await finished;
      expect(execSync).toHaveBeenCalledTimes(4);
      expect(fs.writeFileSync).toHaveBeenCalledTimes(3); // PID and two cycle starts.
    } finally {
      vi.useRealTimers();
    }
  });

  it('defaults to one cycle with tests and no Git operations', async () => {
    expect(parseOptions([])).toEqual({ maxCycles: 1, vitest: true });
    await runPerpetualLoop();
    const commands = vi.mocked(execSync).mock.calls.map(([command]) => command);
    expect(commands).toHaveLength(2);
    expect(commands[0]).toContain('check-five-way-and-file-limits');
    expect(commands[1]).toContain('vitest run');
    expect(commands.join('\n')).not.toMatch(/git|scanner|squads|synthesize/);
    expect(fs.closeSync).toHaveBeenCalledWith(17);
    expect(fs.unlinkSync).toHaveBeenCalledOnce();
  });

  it.each(['0', '-1', 'Infinity', '2junk', '1.5', '9007199254740992', ''])(
    'rejects invalid CLI cycle count %s before work starts',
    value => {
      expect(() => parseOptions(['--cycles', value])).toThrow('positive finite');
      expect(fs.openSync).not.toHaveBeenCalled();
    }
  );

  it.each([Infinity, 0, -1, NaN, 1.5])('rejects unbounded programmatic count %s', async value => {
    await expect(runPerpetualLoop({ maxCycles: value })).rejects.toThrow('positive finite');
    expect(execSync).not.toHaveBeenCalled();
  });

  it('rejects ambiguous cycle flags and attempts to enable Git', async () => {
    expect(() => parseOptions(['--once', '--cycles', '2'])).toThrow('only one');
    expect(() => parseOptions(['--unexpected'])).toThrow('Unknown option');
    await expect(runPerpetualLoop({ git: true })).rejects.toThrow('Git writes are disabled');
  });

  it.each([1, 2])(
    'stops after failed command %s without another cycle or success claim',
    async failureAt => {
      vi.mocked(execSync)
        .mockImplementationOnce(() => {
          if (failureAt === 1) throw new Error('fixture check failure');
          return Buffer.from('');
        })
        .mockImplementationOnce(() => {
          throw new Error('fixture check failure');
        });
      await expect(runPerpetualLoop({ maxCycles: 2 })).rejects.toThrow('fixture check failure');
      expect(execSync).toHaveBeenCalledTimes(failureAt);
      const report = vi
        .mocked(fs.appendFileSync)
        .mock.calls.map(([, text]) => String(text))
        .join('\n');
      expect(report).toContain('FAILED');
      expect(report).not.toContain('PASSED');
      expect(fs.unlinkSync).toHaveBeenCalledOnce();
    }
  );

  it('explicitly reports skipped tests', async () => {
    await runPerpetualLoop(parseOptions(['--once', '--skip-git', '--skip-test']));
    expect(execSync).toHaveBeenCalledTimes(1);
    expect(fs.appendFileSync).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('TESTS SKIPPED')
    );
  });

  it('never removes an existing concurrent or stale lock', async () => {
    vi.mocked(fs.openSync).mockImplementation(() => {
      throw new Error('EEXIST');
    });
    await expect(runPerpetualLoop()).rejects.toThrow('EEXIST');
    expect(fs.unlinkSync).not.toHaveBeenCalled();
    expect(execSync).not.toHaveBeenCalled();
  });

  it('blocks root collisions without moving or deleting source files', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    expect(() => enforceRootHygiene()).toThrow('No files moved or deleted');
    expect(fs.unlinkSync).not.toHaveBeenCalled();
    await expect(runPerpetualLoop()).rejects.toThrow('manual review');
    expect(execSync).not.toHaveBeenCalled();
    expect(fs.unlinkSync).toHaveBeenCalledWith(expect.stringMatching(/ouroboros\.lock$/));
  });
});
