import type { KnipConfig } from 'knip';

import { GLOB_EXTERNAL_TYPES } from '#node/utilities/index.ts';

const knipConfig: KnipConfig = { ignore: [...GLOB_EXTERNAL_TYPES] };

export default knipConfig;
