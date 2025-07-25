import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { System } from '../../../../../system'
import { ID_GEOLOCATION } from '../../../../_ids'

export type I = {
  any: any
}

export type O = {
  position: {
    latitude: number
    longitude: number
  }
}

export default class Geolocation extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['any'],
        o: ['position'],
      },
      {},
      system,
      ID_GEOLOCATION
    )
  }

  async f({ any }: I, done: Done<O>, fail: Fail): Promise<void> {
    const {
      api: {
        geolocation: { getCurrentPosition },
      },
    } = this.__system

    let position

    try {
      position = await getCurrentPosition()
    } catch (err) {
      fail(err.message)

      return
    }

    done({ position })
  }
}
