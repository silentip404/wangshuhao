import {
  GLOBS_TSCONFIG_APP_BASE_INCLUDE,
  GLOBS_TSCONFIG_APP_INCLUDE,
  GLOBS_TSCONFIG_LIB_BASE_INCLUDE,
  GLOBS_TSCONFIG_LIB_INCLUDE,
  GLOBS_TSCONFIG_NODE_BASE_INCLUDE,
  GLOBS_TSCONFIG_NODE_INCLUDE,
} from './globs.ts';

interface Project {
  baseInclude: string[];
  configName: string;
  include: string[];
  name: string;
}

const projects: Project[] = [
  {
    name: 'lib',
    configName: 'tsconfig.lib.json',
    include: [...GLOBS_TSCONFIG_LIB_INCLUDE],
    baseInclude: [...GLOBS_TSCONFIG_LIB_BASE_INCLUDE],
  },
  {
    name: 'app',
    configName: 'tsconfig.app.json',
    include: [...GLOBS_TSCONFIG_APP_INCLUDE],
    baseInclude: [...GLOBS_TSCONFIG_APP_BASE_INCLUDE],
  },
  {
    name: 'node',
    configName: 'tsconfig.node.json',
    include: [...GLOBS_TSCONFIG_NODE_INCLUDE],
    baseInclude: [...GLOBS_TSCONFIG_NODE_BASE_INCLUDE],
  },
];

export { projects };
