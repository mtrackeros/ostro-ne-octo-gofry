/** Represents the progress of a Git cherry picking operation to be shown to the
 * user */
export type GitCherryPickProgress = {
  /** A numeric value between 0 and 1 representing the percent completed */
  readonly value: number
  /** The current number of commits cherry picked as part of this operation */
  readonly cherryPickCommitCount: number
  /** The commit summary associated with the current commit (if found) */
  readonly currentCommitSummary: string | null
  /** The count of known commits that will be cherry picked */
  readonly totalCommitCount: number
}
