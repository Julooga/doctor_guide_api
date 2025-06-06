import defaultConfig from '@julooga/eslint'

export default [
  ...defaultConfig,
  {
    ignores: ['build/**', 'node_modules/**', '.react-router']
  }
]
