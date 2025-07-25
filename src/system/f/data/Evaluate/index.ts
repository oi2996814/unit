import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Fail } from '../../../../Class/Functional/Fail'
import { evaluate } from '../../../../spec/evaluate'
import { System } from '../../../../system'
import { ID_EVALUATE } from '../../../_ids'

type I = {
  str: string
}

type O = {
  a: any
}

export default class Evaluate extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['str'],
        o: ['a'],
      },
      {},
      system,
      ID_EVALUATE
    )
  }

  f({ str }: I, done: Done<O>, fail: Fail): void {
    const { specs, classes } = this.__system

    let a: any

    try {
      a = evaluate(str, specs, classes)
    } catch (err) {
      fail(err.message.toLowerCase())

      return
    }

    done({
      a,
    })
  }
}
