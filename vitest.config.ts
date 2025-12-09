// vitest.config.ts

import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        name: 'tokenizer',
        environment: 'node',
        include: [
            './test/**/*.{test,spec}.ts'
        ],
        exclude: [
            '.vscode/',
            '.gitignore',
            'node_modules/',
            'src/{OLD}*.ts'
        ],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: [
                './src/Tokenizer.ts',
                './src/Parser.ts',
            ],
            exclude: [
                '.vscode/',
                '.gitignore',
                'node_modules/',
                'src/{OLD}*.ts'
            ],
        },
    },
})