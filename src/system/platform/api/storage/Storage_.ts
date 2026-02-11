import { $ } from '../../../../Class/$'
import { ObjectUpdateType } from '../../../../ObjectUpdateType'
import { Primitive } from '../../../../Primitive'
import {
  delete_,
  get,
  hasKey,
  keys,
  read,
  set,
  write,
} from '../../../../client/util/storage'
import { ObjectPathTooDeepError } from '../../../../exception/ObjectPathTooDeep'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { Unlisten } from '../../../../types/Unlisten'
import { J } from '../../../../types/interface/J'
import { V } from '../../../../types/interface/V'
import { identity } from '../../../../util/identity'
import { mapObjKV } from '../../../../util/object'

export type I = {}

export type O = {
  obj: J
}

export default class Storage_ extends Primitive<I, O> {
  constructor(
    system: System,
    id: string,
    prefix: string,
    storage: Storage,
    write_: (value: any) => string = identity,
    read_: (value: string) => any = identity
  ) {
    super(
      {
        i: [],
        o: ['obj'],
      },
      {
        output: {
          obj: {
            ref: true,
          },
        },
      },
      system,
      id
    )

    const self = this

    this._output.obj.push(
      new (class Storage__ extends $ implements V, J {
        private _prefix = prefix

        read(): Dict<string> {
          const { path } = this.__system

          const data = read(storage, path)

          const data_ = mapObjKV(data, (key, value) => {
            return read_(value)
          })

          return data_
        }

        write(data: any): void {
          const { path } = this.__system

          write(storage, path, data)
        }

        get(name: string): any {
          const { path } = this.__system

          const data = get(storage, path, name)

          const data_ = read_(data)

          return data_
        }

        set(name: string, data: any): void {
          const { path, emitter } = this.__system

          const data_ = write_(data)

          set(storage, path, name, data_)

          emitter.emit(`${this._prefix}_storage`, name, data)
        }

        delete(name: string): any {
          const { path, emitter } = this.__system

          delete_(storage, path, name)

          emitter.emit(`${this._prefix}_storage`, name, undefined)
        }

        deepSet(path_: string[], data: any): void {
          const { path } = this.__system

          if (path_.length > 0) {
            throw new ObjectPathTooDeepError()
          }

          const data_ = write_(data)

          set(storage, path_[0], data_, path)
        }

        deepGet(path_: string[]): any {
          const { path } = this.__system

          if (path_.length > 0) {
            throw new ObjectPathTooDeepError()
          }

          const data = get(storage, path, path_[0])

          const data_ = read_(data)

          return data_
        }

        deepDelete(path_: string[]): void {
          const { path } = this.__system

          if (path_.length > 1) {
            throw new ObjectPathTooDeepError()
          }

          return delete_(storage, path, path_[0])
        }

        deepHas(path: string[]): boolean {
          try {
            this.deepGet(path)

            return true
          } catch (err) {
            return false
          }
        }

        subscribe(
          path: string[],
          key: string,
          listener: (
            type: ObjectUpdateType,
            path: string[],
            key: string,
            data: any
          ) => void
        ): Unlisten {
          const { emitter } = this.__system

          if (path.length > 0) {
            throw new ObjectPathTooDeepError()
          }

          return emitter.addListener(
            `${this._prefix}_storage`,
            (key_, value) => {
              if (key_ === key || key === '*') {
                if (value === undefined) {
                  listener('delete', [], key, value)
                } else {
                  listener('set', [], key, value)
                }
              }
            }
          )
        }

        keys(): string[] {
          const { path } = this.__system

          return keys(storage, path)
        }

        hasKey(name: string): boolean {
          const { path } = this.__system

          const has = hasKey(storage, path, name)

          return has
        }
      })(this.__system)
    )
  }

  t(value: string) {
    return value
  }
}
