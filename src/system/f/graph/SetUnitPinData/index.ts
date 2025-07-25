import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { stringify } from '../../../../spec/stringify'
import { System } from '../../../../system'
import { $G } from '../../../../types/interface/async/$G'
import { Async } from '../../../../types/interface/async/Async'
import { IO } from '../../../../types/IO'
import { ID_SET_UNIT_PIN_DATA_0 } from '../../../_ids'

export interface I<T> {
  graph: $G
  id: string
  type: IO
  name: string
  data: any
}

export interface O<T> {}

export default class SetUnitPinData<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['graph', 'id', 'type', 'name', 'data'],
        o: [],
      },
      {
        input: {
          graph: {
            ref: true,
          },
        },
      },
      system,
      ID_SET_UNIT_PIN_DATA_0
    )
  }

  f({ graph, id, type, name, data }: I<T>, done: Done<O<T>>, fail: Fail): void {
    graph = Async(graph, ['G'], this.__system.async)

    try {
      graph.$setUnitPinData({
        unitId: id,
        type,
        pinId: name,
        data: stringify(data),
      })
    } catch (err) {
      fail(err.message)

      return
    }

    done()
  }
}
