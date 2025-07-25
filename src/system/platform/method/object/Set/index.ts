import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { System } from '../../../../../system'
import { J } from '../../../../../types/interface/J'
import { ID_SET_1 } from '../../../../_ids'

export interface I<T> {
  obj: J
  name: string
  data: T
}

export interface O<T> {
  data: any
}

export default class Set<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['obj', 'name', 'data'],
        o: ['data'],
      },
      {
        input: {
          obj: {
            ref: true,
          },
        },
      },
      system,
      ID_SET_1
    )
  }

  async f({ obj, name, data }: I<T>, done: Done<O<T>>, fail: Fail) {
    try {
      await obj.set(name, data)
    } catch (err) {
      fail(err.message)

      return
    }

    done({ data })
  }
}
