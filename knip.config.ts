import type { KnipConfig } from 'knip';

import { GLOB_TYPINGS } from '#node/utilities/globs.ts';

const knipConfig: KnipConfig = {
  ignore: [GLOB_TYPINGS],
};

export default knipConfig;
