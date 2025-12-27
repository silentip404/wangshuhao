import fs from 'fs';
import path from 'path';

import { minimatch } from 'minimatch';
import { isEmptyish, map, omit, partition, pipe, sumBy } from 'remeda';
import { parse } from 'ts-command-line-args';
import { z } from 'zod';

import { JSON_INDENT, printMessage } from '#lib/utils/index.ts';
import {
  helpArgConfig,
  helpArgOptions,
  readJsoncFile,
  resolveFromRoot,
  toRelativePosixPath,
} from '#node/utils/index.ts';
import type { WithHelpArg } from '#node/utils/index.ts';

import { typeCheckViaApi, typeCheckViaCli } from './tsc-files/index.ts';

const benchmarkRecordSchema = z
  .object({
    timestamp: z.string(),
    fileCount: z.number(),
    apiDuration: z.number(),
    cliDuration: z.number(),
  })
  .catchall(z.unknown());

type BenchmarkRecord = z.infer<typeof benchmarkRecordSchema>;

const benchmarkLogSchema = z
  .object({
    records: z.array(benchmarkRecordSchema),
    totalApiDuration: z.number(),
    totalCliDuration: z.number(),
  })
  .catchall(z.unknown());

type BenchmarkLog = z.infer<typeof benchmarkLogSchema>;

const BENCHMARK_LOG_PATH = resolveFromRoot('scratch/tsc-files/benchmark.json');

type CliArguments = WithHelpArg<{
  'files': string[];
  'ignore-unknown'?: boolean;
}>;

const TS_FILE_EXTENSIONS_PATTERN =
  '**/*.{ts,tsx,d.ts,js,jsx,cts,d.cts,cjs,mts,d.mts,mjs}';

const cliArguments = parse<CliArguments>(
  {
    ...helpArgConfig,

    'files': {
      type: String,
      typeLabel: 'file1.ts file2.ts ...',
      defaultOption: true,
      multiple: true,
      description: '文件列表',
    },
    'ignore-unknown': {
      type: Boolean,
      optional: true,
      description: '是否自动忽略未知文件',
    },
  },
  {
    ...helpArgOptions,

    headerContentSections: [
      {
        header: path.basename(import.meta.url),
        content: '在尊重 tsconfig.json 配置的前提下，仅对指定文件运行 tsc 检查',
      },
    ],
  },
);

const options = omit(cliArguments, ['help']);

const { files, 'ignore-unknown': shouldIgnoreUnknown } = options;

const [typeCheckableFiles, unsupportedFiles] = pipe(
  files,
  map((filename) => toRelativePosixPath({ filename })),
  partition(minimatch.filter(TS_FILE_EXTENSIONS_PATTERN)),
);

// 如果存在未知文件且未设置忽略未知文件，则报错退出
if (!isEmptyish(unsupportedFiles) && shouldIgnoreUnknown !== true) {
  printMessage({
    type: 'error',
    title: '检测到未知文件',
    description: [
      '以下文件无法运行 tsc 检查:',
      ...unsupportedFiles.map((file) => `  - ${file}`),
      '',
      '如需自动忽略未知文件，请使用 --ignore-unknown 选项',
    ],
  });

  process.exit(1);
}

if (isEmptyish(typeCheckableFiles)) {
  process.exit(0);
}

// 依次运行 API 模式和 CLI 模式，并记录执行时间
const apiStartTime = performance.now();
const apiResult = typeCheckViaApi(typeCheckableFiles);
const apiEndTime = performance.now();
const apiDuration = Math.round(apiEndTime - apiStartTime);

const cliStartTime = performance.now();
const cliResult = await typeCheckViaCli(typeCheckableFiles);
const cliEndTime = performance.now();
const cliDuration = Math.round(cliEndTime - cliStartTime);

// 写入执行时间记录
const benchmarkRecord: BenchmarkRecord = {
  timestamp: new Date().toLocaleString(),
  fileCount: typeCheckableFiles.length,
  apiDuration,
  cliDuration,
};

// 确保目录存在
const benchmarkLogDir = path.dirname(BENCHMARK_LOG_PATH);
fs.mkdirSync(benchmarkLogDir, { recursive: true });

// 读取现有记录或创建新对象
let benchmarkLog: BenchmarkLog = {
  totalApiDuration: 0,
  totalCliDuration: 0,
  records: [],
};

if (fs.existsSync(BENCHMARK_LOG_PATH)) {
  const content = await readJsoncFile(BENCHMARK_LOG_PATH);

  benchmarkLog = benchmarkLogSchema.parse(content);
}

// 添加新记录并更新累计时长
benchmarkLog.records.unshift(benchmarkRecord);
benchmarkLog.totalApiDuration = sumBy(
  benchmarkLog.records,
  (record) => record.apiDuration,
);
benchmarkLog.totalCliDuration = sumBy(
  benchmarkLog.records,
  (record) => record.cliDuration,
);

fs.writeFileSync(
  BENCHMARK_LOG_PATH,
  JSON.stringify(benchmarkLog, null, JSON_INDENT),
);

// 打印 API 模式输出
if (!apiResult.isSuccess) {
  printMessage({
    type: 'error',
    title: '运行 tsc 检查失败（API 模式）',
    description: apiResult.output,
  });
}

// 打印 CLI 模式输出
if (!cliResult.isSuccess) {
  printMessage({
    type: 'error',
    title: '运行 tsc 检查失败（CLI 模式）',
    description: cliResult.output,
  });
}

// 任一模式检测到错误则退出
if (!apiResult.isSuccess || !cliResult.isSuccess) {
  process.exit(1);
}
