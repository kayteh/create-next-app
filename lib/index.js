const path = require('path')
const fs = require('fs')
const copyDir = require('./utils/copy-dir')
const install = require('./utils/install')
const loadExample = require('./utils/load-example')
const messages = require('./messages')

module.exports = function createNextApp(opts) {
  const projectName = opts.projectName

  if (!projectName) {
    console.log(messages.missingProjectName())
    process.exit(1)
  }

  if (fs.existsSync(projectName) && projectName !== '.') {
    console.log(messages.alreadyExists(projectName))
    process.exit(1)
  }

  const projectPath = (opts.projectPath = process.cwd() + '/' + projectName)

  if (opts.example) {
    loadExample({
      projectName: projectName,
      example: opts.example
    }).then(installWithMessageFactory(opts))
  } else {
    const templatePath = path.resolve(__dirname, './templates/default')

    copyDir({
      templatePath: templatePath,
      projectPath: projectPath,
      projectName: projectName
    })
      .then(installWithMessageFactory(opts))
      .catch(function(err) {
        throw err
      })
  }
}

function installWithMessageFactory(opts) {
  const projectName = opts.projectName
  const projectPath = opts.projectPath

  return function installWithMessage() {
    return install({
      projectName: projectName,
      projectPath: projectPath,
      packages: ['react', 'react-dom', 'next', 'styled-components'],
      devPackages: [
        // flow stuff
        'flow-bin',
        'flow-typed',

        // jest
        'jest',
        'jest-styled-components',
        'react-test-renderer',

        // enzyme
        'enzyme',
        'enzyme-adapter-react-16',
        'enzyme-to-json',

        // linters
        'standard',
        'eslint',
        'eslint-plugin-flowtype',

        'stylelint',
        'stylelint-config-standard',
        'stylelint-config-styled-components',
        'stylelint-processor-styled-components',

        // babel
        '@babel/core',
        '@babel/preset-flow',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-transform-runtime',
        'babel-plugin-styled-components',
        'babel-jest',
        'babel-eslint'
      ]
    })
      .then(function() {
        console.log(messages.start(projectName))
      })
      .catch(function(err) {
        throw err
      })
  }
}
