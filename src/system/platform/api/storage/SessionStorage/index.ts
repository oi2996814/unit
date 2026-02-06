import { System } from '../../../../../system'
import { ID_SESSION_STORAGE } from '../../../../_ids'
import Storage_ from '../Storage_'

export type I = {}

export type O = {}

export default class SessionStorage extends Storage_ {
  constructor(system: System) {
    const {
      api: {
        window: { sessionStorage },
      },
    } = system

    super(system, ID_SESSION_STORAGE, 'session', sessionStorage)
  }
}
