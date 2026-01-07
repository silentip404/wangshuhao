import type { KnipConfig } from 'knip';

import { GLOB_EXTERNAL_TYPE_DECLARATIONS } from '#node/utilities/globs.ts';

const knipConfig: KnipConfig = {
  ignore: [GLOB_EXTERNAL_TYPE_DECLARATIONS],
};

export default knipConfig;
