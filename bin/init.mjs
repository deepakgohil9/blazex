#!/usr/bin/env node

import { promisify } from 'util'
import cp from 'child_process'
import path from 'path'
import fs from 'fs'
import ora from 'ora'

const exec = promisify(cp.exec)
const rm = promisify(fs.rm)

if (process.argv.length < 3) {
	console.error('You must provide a name for the project')
	console.error('Example: npx blaze my-project')
	process.exit(1)
}

const projectName = process.argv[2]
const currentDir = process.cwd()
const projectDir = path.join(currentDir, projectName)

const gitRepo = 'https://github.com/deepakgohil9/blaze.git'

if (fs.existsSync(projectDir)) {
	console.error(`Directory ${projectName} already exists`)
	process.exit(1)
}

fs.mkdirSync(projectDir)

const downloadProject = async () => {
	const spinner = ora('Downloading files...').start()
	await exec(`git clone --depth 1 ${gitRepo} ${projectDir} --quiet`)
	spinner.succeed()
}

const cleanProject = async () => {
	const spinner = ora('Cleaning files...').start()
	await rm(path.join(projectDir, '.git'), { recursive: true, force: true })
	await rm(path.join(projectDir, 'bin'), { recursive: true, force: true })
	await rm(path.join(projectDir, 'LICENSE'), { force: true })
	await rm(path.join(projectDir, 'README.md'), { force: true })
	await rm(path.join(projectDir, 'package-lock.json'), { force: true })
	process.chdir(projectDir)
	await exec('npm uninstall ora')
	spinner.succeed()
}

const installDependencies = async () => {
	const spinner = ora('Installing dependencies...').start()
	await exec('npm install')
	spinner.succeed()
}

const updatingDependencies = async () => {
	const spinner = ora('Updating dependencies...').start()
	await exec('npm update --save')
	spinner.succeed()
}

const updatePackageJson = async () => {
	const spinner = ora('Updating package.json...').start()
	const packageJsonPath = path.join(projectDir, 'package.json')
	const packageText = fs.readFileSync(packageJsonPath, 'utf8')
	const packageJson = JSON.parse(packageText)
	packageJson.name = projectName
	packageJson.version = '1.0.0'
	packageJson.description = ''
	packageJson.author = ''
	packageJson.license = ''
	delete packageJson.bin
	delete packageJson.repository
	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, 0, /\t/.test(packageText) ? '\t' : 2) + '\n')
	spinner.succeed()
}

const main = async () => {
	try {
		await downloadProject()
		await cleanProject()
		await installDependencies()
		await updatingDependencies()
		await updatePackageJson()
		console.log(`Project ${projectName} created successfully!`)
	} catch (error) {
		fs.rmSync(projectDir, { recursive: true, force: true })
		console.error('Error creating project', error)
	}
}

main()
