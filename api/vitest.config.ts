import {defineConfig} from 'vitest/config';
export default defineConfig({test:{include:['test/**/*.test.ts'],pool:'forks',maxWorkers:1,testTimeout:20000,hookTimeout:20000,reporters:['verbose']}});
