import { ensureDependenciesInPackage } from './utils/ensure.ts';

import type { KnipConfig } from 'knip';

const knipConfig: KnipConfig = {
  ignoreDependencies: ensureDependenciesInPackage(['typesync']),
};

export default knipConfig;
