module.exports = {
  root: true,
  extends: ['expo'],
  ignorePatterns: [
    'node_modules/**',
    '.claude/**',
    '.expo/**',
    'ios/Pods/**',
    'ios/build/**',
    'android/build/**',
    'android/app/build/**',
    'dist/**',
    'build/**',
    'coverage/**',
    'patches/**',
    '*.png',
    '*.jpg',
    '*.jpeg',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
  },
  overrides: [
    {
      files: ['**/*.tsx'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: 'react-native',
                importNames: ['StyleSheet'],
                message:
                  'Estilos devem ficar em um arquivo styles.ts/.styles.ts separado, nunca dentro do .tsx.',
              },
            ],
            patterns: [
              {
                group: ['**/*.store', '**/*.store.*'],
                message:
                  'Componentes visuais não devem acessar stores diretamente. Exponha isso por um hook personalizado.',
              },
            ],
          },
        ],
        'no-restricted-syntax': [
          'error',
          {
            selector: 'TSTypeAliasDeclaration, TSInterfaceDeclaration',
            message:
              'Tipagens não devem ser declaradas em .tsx. Mova para um arquivo *.types.ts.',
          },
          {
            selector:
              'CallExpression[callee.object.name="StyleSheet"][callee.property.name="create"]',
            message:
              'Estilos devem ficar em um arquivo styles.ts/.styles.ts separado.',
          },
          {
            selector: 'JSXAttribute[name.name="style"] ObjectExpression',
            message: 'Style inline não é permitido. Use styles.ts/.styles.ts.',
          },
          {
            selector:
              'CallExpression[callee.object.name="React"][callee.property.name=/^use(State|Effect|Memo|Ref)$/]',
            message:
              'Arquivos .tsx não devem chamar useState/useEffect/useMemo/useRef. Mova para hook personalizado.',
          },
          {
            selector: 'CallExpression[callee.name=/^use[A-Z].*Store$/]',
            message:
              'Componentes visuais não devem acessar stores diretamente. Exponha isso por um hook personalizado.',
          },
          {
            selector:
              'ExportNamedDeclaration ~ ExportNamedDeclaration > FunctionDeclaration[id.name=/^[A-Z]/]',
            message:
              'Cada componente exportado deve ficar em seu proprio arquivo .tsx. Use um barrel para reexportar se precisar.',
          },
          {
            selector:
              'ExportNamedDeclaration ~ ExportNamedDeclaration > VariableDeclaration > VariableDeclarator[id.name=/^[A-Z]/]',
            message:
              'Cada componente exportado deve ficar em seu proprio arquivo .tsx. Use um barrel para reexportar se precisar.',
          },
          {
            selector:
              'FunctionDeclaration[id.name=/^[A-Z]/] ~ FunctionDeclaration[id.name=/^[A-Z]/]',
            message:
              'Cada componente visual, mesmo local, deve ficar em seu proprio arquivo .tsx.',
          },
          {
            selector:
              'VariableDeclaration > VariableDeclarator[id.name=/^[A-Z]/][init.type="ArrowFunctionExpression"] ~ VariableDeclaration > VariableDeclarator[id.name=/^[A-Z]/][init.type="ArrowFunctionExpression"]',
            message:
              'Cada componente visual, mesmo local, deve ficar em seu proprio arquivo .tsx.',
          },
        ],
      },
    },
    {
      files: ['App.tsx', 'src/**/*.tsx'],
      excludedFiles: ['src/components/**/*.tsx'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: 'react',
                importNames: ['useEffect', 'useMemo', 'useRef', 'useState'],
                message:
                  'Pages, containers e shells em .tsx devem ser apenas renderização. Mova estado/efeitos para um hook useSetup... ou hook específico.',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['App.tsx', 'src/**/*Page.tsx', 'src/**/*Navigator.tsx'],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector: 'Program > FunctionDeclaration[id.name!=/^[A-Z]/]',
            message:
              'Funcoes auxiliares nesses arquivos devem ir para um hook personalizado ou arquivo .ts de apoio.',
          },
          {
            selector:
              'Program > VariableDeclaration > VariableDeclarator[id.name=/^[a-z]/][init.type="ArrowFunctionExpression"]',
            message:
              'Funcoes auxiliares nesses arquivos devem ir para um hook personalizado ou arquivo .ts de apoio.',
          },
        ],
      },
    },
  ],
};
