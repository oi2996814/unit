import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../Class/Holder'
import { apiNotSupportedError } from '../../../../../exception/APINotImplementedError'
import { System } from '../../../../../system'
import { FR } from '../../../../../types/interface/FR'
import { wrapFileReader } from '../../../../../wrap/FileReader'
import { ID_FILE_READER } from '../../../../_ids'

export type I = {
  opt: {}
  done: any
}

export type O = {
  reader: FR & $
}

export default class FileReader extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['opt'],
        fo: ['reader'],
        i: [],
        o: [],
      },
      {
        output: {
          reader: {
            ref: true,
          },
        },
      },
      system,
      ID_FILE_READER
    )
  }

  async f({ opt }: I, done: Done<O>, fail: Fail): Promise<void> {
    const {
      api: {
        file: { FileReader },
      },
    } = this.__system

    if (!FileReader) {
      fail(apiNotSupportedError('FileReader'))

      return
    }

    const reader_ = new FileReader()

    const reader = wrapFileReader(reader_, this.__system)

    done({ reader })
  }
}
