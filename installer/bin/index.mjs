#!/usr/bin/env node

import fs from 'fs'
import { execa } from 'execa'
import Listr from 'listr'
import got from 'got'

const POSTHOOK_URL =
  'https://raw.githubusercontent.com/jozan/branch-dance/main/post-checkout'

async function write(path, content) {
  await fs.promises.writeFile(path, content)
}

async function fileExists(path) {
  try {
    const result = await fs.promises.stat(path)
    return result.isFile()
  } catch (error) {
    return false
  }
}

async function getMusicFilePath() {
  const root = await getGitRepoRoot()
  return `${root}/MUSIC`
}

async function getGitRepoRoot() {
  const { stdout } = await execa('git', ['rev-parse', '--show-toplevel'])
  return stdout
}

async function getHookPath() {
  const { stdout } = await execa('git', ['rev-parse', '--git-dir'])
  return `${stdout}/hooks/post-checkout`
}

class TaskError extends Error {
  constructor(message) {
    super(message)
    this.name = 'TaskError'
  }
}

console.log('\n🎸 setting up branch-dance for your git repository...')
console.log('🎶 > for more info: https://github.com/jozan/branch-dance\n')

const tasks = new Listr(
  [
    {
      title: 'is initiated in git repository',
      task: async () => {
        try {
          await execa('git', ['rev-parse', '--is-inside-work-tree'])
        } catch (error) {
          throw new TaskError('some post-checkout is already installed')
        }
      }
    },
    {
      title: 'checking if post-checkout hook exists',
      task: async () => {
        try {
          const hookPath = await getHookPath()
          if (await fileExists(hookPath)) {
            throw new TaskError(
              'some post-checkout is already installed. aborting'
            )
          }
        } catch (error) {
          throw new TaskError(
            'some post-checkout is already installed. aborting'
          )
        }
      }
    },
    {
      title: 'check that spotify-tui (spt) is installed',
      task: async () => {
        try {
          await execa('command', ['-v', 'spt'])
        } catch (error) {
          throw new TaskError(
            'spt not found. install instructions: https://github.com/Rigellute/spotify-tui'
          )
        }
      }
    },
    {
      title: 'install post-checkout hook',
      task: async () => {
        try {
          const hookPath = await getHookPath()
          const hook = await got(POSTHOOK_URL).text()
          await write(hookPath, hook)
          await execa('chmod', ['+x', hookPath])
        } catch (error) {
          console.log(error)
          throw new TaskError(
            "could not install post-checkout hook. make sure you're in a git repository."
          )
        }
      }
    },
    {
      title: "create MUSIC file in git repo root (if it doesn't exist)",
      task: async () => {
        try {
          const { stdout: currentBranch } = await execa('git', [
            'rev-parse',
            '--abbrev-ref',
            'HEAD'
          ])
          const musicFileContent = `${currentBranch}=spotify:track:7E6VM4eg8ADYdgbMnXO97d`
          const musicFile = await getMusicFilePath()
          await write(musicFile, musicFileContent)
        } catch (error) {
          throw new TaskError('could not create MUSIC file')
        }
      },
      skip: async () => {
        try {
          return await fileExists(await getMusicFilePath())
        } catch (error) {
          return true
        }
      }
    }
  ],
  {
    exitOnError: true
  }
)

tasks
  .run()
  .then(() => {
    console.log('all done!')
  })
  .catch((error) => {
    if (error instanceof TaskError) {
      // error is expected and handled by the task itself
    } else {
      console.error(error)
    }
  })
