import fs from 'fs-extra';
import tmp from 'tmp';
import path from 'path';

// Clean up temporary directories on process exit
tmp.setGracefulCleanup();

interface TestFixture {
  copy(): Promise<void>;
  resolve(...paths: string[]): string;
  cleanup(): void;
}

export function createTestFixture(): TestFixture {
  let tempDir: string | null = null;
  const fixturesDir = path.join(__dirname, '../../test/fixtures');

  return {
    async copy(): Promise<void> {
      if (!tempDir) {
        tempDir = tmp.dirSync({unsafeCleanup: true}).name;
      }

      // Copy test fixtures to temp directory
      await fs.copy(fixturesDir, tempDir);
    },

    resolve(...paths: string[]): string {
      if (!tempDir) {
        throw new Error('Must call copy() before resolve()');
      }
      return path.join(tempDir, ...paths);
    },

    cleanup(): void {
      if (tempDir) {
        fs.removeSync(tempDir);
        tempDir = null;
      }
    },
  };
}
