// @flow
import * as statusTypes from './statusTypes'
export type StatusType = $Values<typeof statusTypes>

export const PENDING = 'PENDING'
export const IN_PROGRESS = 'IN_PROGRESS'
export const COMPLETE = 'COMPLETE'
export const FAILED = 'FAILED'
