import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { Component_ } from '../../../../../types/interface/Component'
import { Unlisten } from '../../../../../types/Unlisten'
import { ID_ATTACH_TEXT } from '../../../../_ids'

export interface I<T> {
  component: Component_
  text: string
  type: string
  done: any
}

export interface O<T> {}

export const VALID_MIME_TYPES = ['text/plain', 'text/html', 'text/uri-list']

export default class AttachText<T> extends Holder<I<T>, O<T>> {
  private _unlisten: Unlisten

  constructor(system: System) {
    super(
      {
        fi: ['component', 'text', 'type'],
        fo: [],
        i: [],
        o: [],
      },
      {
        input: {
          component: {
            ref: true,
          },
        },
      },
      system,
      ID_ATTACH_TEXT
    )
  }

  async f({ component, text, type }: I<T>, done: Done<O<T>>, fail: Fail) {
    if (!VALID_MIME_TYPES.includes(type)) {
      fail('invalid mime type')

      return
    }

    this._unlisten = component.attachText(type, text)
  }

  d() {
    if (this._unlisten) {
      this._unlisten()

      this._unlisten = undefined
    }
  }
}
