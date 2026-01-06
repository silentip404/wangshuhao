import {
  GLOB_TSCONFIG_APP_BASE_INCLUDE,
  GLOB_TSCONFIG_APP_INCLUDE,
  GLOB_TSCONFIG_LIB_BASE_INCLUDE,
  GLOB_TSCONFIG_LIB_INCLUDE,
  GLOB_TSCONFIG_NODE_BASE_INCLUDE,
  GLOB_TSCONFIG_NODE_INCLUDE,
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
    include: [...GLOB_TSCONFIG_LIB_INCLUDE],
    baseInclude: [...GLOB_TSCONFIG_LIB_BASE_INCLUDE],
  },
  {
    name: 'app',
    configName: 'tsconfig.app.json',
    include: [...GLOB_TSCONFIG_APP_INCLUDE],
    baseInclude: [...GLOB_TSCONFIG_APP_BASE_INCLUDE],
  },
  {
    name: 'node',
    configName: 'tsconfig.node.json',
    include: [...GLOB_TSCONFIG_NODE_INCLUDE],
    baseInclude: [...GLOB_TSCONFIG_NODE_BASE_INCLUDE],
  },
];

export { projects };
