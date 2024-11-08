#!/usr/bin/env node

import { promisify } from 'util'
import cp from 'child_process'
import fs from 'fs'
import path from 'path'
import { rimraf } from 'rimraf'
import yoctoSpinner from 'yocto-spinner'

const exec = promisify(cp.exec)

import process from 'node:process';

const runCommand = async (command, description) => {
  const spinner = yoctoSpinner({ text: description }).start()
  try {
    await exec(command)
    spinner.success()
  }
  catch (error) {
    spinner.error()
    console.error(error)
  }
}

if (process.argv.length < 3) {
  console.error('Please provide a project name!')
  console.error('Example:')
  console.error('    npx blazex my-project')
  process.exit(1)
}

const projectName = process.argv[2]
const currentDir = process.cwd()
const projectDir = path.join(currentDir, projectName)

const gitRepo = 'https://github.com/deepakgohil9/blaze.git'

if (fs.existsSync(projectDir)) {
  console.error(`Directory ${projectName} already exists!`)
  process.exit(1)
}

fs.mkdirSync(projectDir)

const setupProject = async () => {
  let spinner
  try {
    await runCommand(`git clone --depth 1 ${gitRepo} ${projectName} --quiet`, 'Downloading project template...')

    // Removing unnecessary extra files
    spinner = yoctoSpinner({ text: 'Cleaning up project...' }).start()
    // await fs.unlink(path.join(projectDir, 'LICENSE'))
    // await fs.unlink(path.join(projectDir, 'package-lock.json'))
    await rimraf(path.join(projectDir, 'LICENSE'))
    await rimraf(path.join(projectDir, 'package-lock.json'))
    await rimraf(path.join(projectDir, '.git'))
    await rimraf(path.join(projectDir, '.github'))
    await rimraf(path.join(projectDir, 'bin'))
    spinner.success()

    // Changing working directory to project directory
    process.chdir(projectDir)

    // Initializing git repository
    await runCommand('git init', 'Initializing git repository...')

    // Installing dependencies
    await runCommand('npm install', 'Installing dependencies...')
    await runCommand('npm uninstall ora rimraf', 'Removing unnecessary dependencies...')

    // Updating package.json
    spinner = yoctoSpinner({ text: 'Updating package.json...' }).start()
    const fileContent = fs.readFileSync(path.join(projectDir, 'package.json'), 'utf8')
    const packageJson = JSON.parse(fileContent)
    packageJson.name = projectName
    packageJson.version = '0.1.0'
    packageJson.description = ''
    packageJson.author = ''
    packageJson.keywords = []
    packageJson.license = ''
    delete packageJson.repository
    delete packageJson.bin
    spinner.success()

    console.log('')
    console.log('🎉 Project has been initialized successfully!')
    console.log('')
    console.log('🚀 To get started:')
    console.log(`    Run command: cd ${projectName}`)
    console.log('    Create a new .env file based on the .env.example file')
    console.log('    Run command: npm run dev')
    console.log('')
    console.log('🦄 Enjoy your production-ready project! with a large set of ready-to-use features and tools. Check out the README.md file for more information.')
    console.log('')
  } catch (error) {
    if (spinner) spinner.error()
    fs.rmSync(projectDir, { recursive: true })
    console.error(error)
  }
}

setupProject()
