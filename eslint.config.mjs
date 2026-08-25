import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,cts,js,mjs,cjs,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/node_modules/**', '**/*.tsbuildinfo', '**/coverage/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    name: 'vue/typescript',
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
  },
  {
    name: 'project/rules',
    rules: {
      'no-undef': 'off', // 未定义变量交给 TypeScript 检查
      'vue/multi-word-component-names': 'off', // 个人项目允许单词组件名（如 Home、Devices）
      'vue/no-v-html': 'off', // 智能家居面板可能需要渲染富文本 / HTML 内容
      'vue/max-attributes-per-line': 'off',
      'vue/html-self-closing': 'off',
    },
  },
)
