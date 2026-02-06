import { System } from '../../../../../system'
import { ID_LOCAL_STORAGE } from '../../../../_ids'
import Storage_ from '../Storage_'

export type I = {}

export type O = {}

export default class _LocalStorage extends Storage_ {
  constructor(system: System) {
    const {
      api: {
        window: { localStorage },
      },
    } = system

    super(system, ID_LOCAL_STORAGE, 'local', localStorage)
  }
}
