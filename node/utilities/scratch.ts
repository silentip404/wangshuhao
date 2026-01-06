import { mkdir, writeFile } from 'node:fs/promises';

import { resolveFromRoot } from './path.ts';

const SCRATCH_DIRECTORY = 'scratch';

interface WriteToScratchOptions {
  contents: string;
  filename: string;
}
interface WriteToScratchResult {
  outputPath: string;
}

const writeToScratch = async ({
  contents,
  filename,
}: WriteToScratchOptions): Promise<WriteToScratchResult> => {
  const scratchDirectory = resolveFromRoot(SCRATCH_DIRECTORY);

  await mkdir(scratchDirectory, {
    recursive: true,
  });

  const outputPath = resolveFromRoot(SCRATCH_DIRECTORY, filename);

  await writeFile(outputPath, contents, 'utf8');

  return {
    outputPath,
  };
};

export { writeToScratch };
