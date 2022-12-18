import { getCommit, getCommits } from '../../../src/lib/git'
import { cherryPick, CherryPickResult } from '../../../src/lib/git/cherry-pick'
import { Branch } from '../../../src/models/branch'
import { Repository } from '../../../src/models/repository'
import { getBranchOrError } from '../../helpers/git'
import { createRepository } from '../../helpers/repository-builder-cherry-pick-test'
import { makeCommit, switchTo } from '../../helpers/repository-scaffolding'

const featureBranchName = 'this-is-a-feature'
const targetBranchName = 'target-branch'

describe('git/cherry-pick', () => {
  let repository: Repository
  let featureBranch: Branch
  let targetBranch: Branch
  let result: CherryPickResult
  beforeEach(async () => {
    // this will create a repository with a
    // feature branch with one commit to cherry pick
    // and will check out the target branch
    repository = await createRepository(featureBranchName, targetBranchName)

    // branch with tip as commit to cherry pick
    featureBranch = await getBranchOrError(repository, featureBranchName)

    // branch with to cherry pick to
    targetBranch = await getBranchOrError(repository, targetBranchName)
  })

  describe('successful cherry pick one commit without conflicts', () => {
    beforeEach(async () => {
      result = await cherryPick(repository, featureBranch.tip.sha)
    })

    it('the latest commit is the cherry picked commit', async () => {
      const cherryPickedCommit = await getCommit(
        repository,
        featureBranch.tip.sha
      )

      const commits = await getCommits(repository, targetBranch.ref, 3)
      // should be starter commit and feature branch commit
      expect(commits.length).toBe(2)
      expect(commits[0].summary).toBe(cherryPickedCommit!.summary)
    })

    it('the result is that it completed without error', async () => {
      expect(result).toBe(CherryPickResult.CompletedWithoutError)
    })
  })

  describe('successful cherry pick multiple commit without conflicts', () => {
    let firstCommitSha: string

    beforeEach(async () => {
      firstCommitSha = featureBranch.tip.sha

      // add two more commits to cherry pick
      await switchTo(repository, featureBranchName)

      const featureBranchCommitTwo = {
        commitMessage: 'Cherry Picked Feature! Number Two',
        entries: [
          {
            path: 'THING_TWO.md',
            contents: '# HELLO WORLD! \nTHINGS GO HERE\n',
          },
        ],
      }

      await makeCommit(repository, featureBranchCommitTwo)

      const featureBranchCommitThree = {
        commitMessage: 'Cherry Picked Feature! Number Three',
        entries: [
          {
            path: 'THING_THREE.md',
            contents: '# HELLO WORLD! \nTHINGS GO HERE\n',
          },
        ],
      }

      await makeCommit(repository, featureBranchCommitThree)

      featureBranch = await getBranchOrError(repository, featureBranchName)

      // switch to the target branch
      await switchTo(repository, targetBranchName)

      const commitRange = `${firstCommitSha}^..${featureBranch.tip.sha}`
      result = await cherryPick(repository, commitRange)
    })

    it('the target branch has', async () => {
      const cherryPickedCommit = await getCommit(
        repository,
        featureBranch.tip.sha
      )
      expect(cherryPickedCommit?.summary).toBe('foo')

      const commits = await getCommits(repository, targetBranch.ref, 5)
      // should be starter commit and feature branch commit
      expect(commits.length).toBe(4)
      expect(commits[0].summary).toBe(cherryPickedCommit!.summary)
    })

    it('the result is that it completed without error', async () => {
      expect(result).toBe(CherryPickResult.CompletedWithoutError)
    })
  })

  describe('successful cherry pick multiple commit without conflicts', () => {
    let firstCommitSha: string

    beforeEach(async () => {
      firstCommitSha = featureBranch.tip.sha

      // add two more commits to cherry pick
      await switchTo(repository, featureBranchName)

      const featureBranchCommitTwo = {
        commitMessage: 'Cherry Picked Feature! Number Two',
        entries: [
          {
            path: 'THING_TWO.md',
            contents: '# HELLO WORLD! \nTHINGS GO HERE\n',
          },
        ],
      }

      await makeCommit(repository, featureBranchCommitTwo)

      const featureBranchCommitThree = {
        commitMessage: 'Cherry Picked Feature! Number Three',
        entries: [
          {
            path: 'THING_THREE.md',
            contents: '# HELLO WORLD! \nTHINGS GO HERE\n',
          },
        ],
      }

      await makeCommit(repository, featureBranchCommitThree)

      featureBranch = await getBranchOrError(repository, featureBranchName)

      // switch to the target branch
      await switchTo(repository, targetBranchName)

      const commitRange = `${firstCommitSha}^..${featureBranch.tip.sha}`
      result = await cherryPick(repository, commitRange)
    })

    it('the target branch has', async () => {
      const cherryPickedCommit = await getCommit(
        repository,
        featureBranch.tip.sha
      )
      expect(cherryPickedCommit?.summary).toBe('foo')

      const commits = await getCommits(repository, targetBranch.ref, 5)
      // should be starter commit and feature branch commit
      expect(commits.length).toBe(4)
      expect(commits[0].summary).toBe(cherryPickedCommit!.summary)
    })

    it('the result is that it completed without error', async () => {
      expect(result).toBe(CherryPickResult.CompletedWithoutError)
    })
  })
})
