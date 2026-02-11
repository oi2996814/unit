import { System } from '../../../../../system'
import { ID_LOCAL_OBJECT } from '../../../../_ids'
import Storage_ from '../Storage_'

export type I = {}

export type O = {}

export default class LocalObject extends Storage_ {
  constructor(system: System) {
    const {
      api: {
        window: { localStorage },
      },
    } = system

    const objectStorage = new (class LocalStorageObjectStorage
      implements Storage
    {
      constructor() {
        if (typeof localStorage === 'undefined') {
          throw new Error('localStorage is not available in this environment')
        }
      }

      private normalizeKey(key: string): string {
        return key.replace(/\.\./g, '').replace(/^\/+/, '')
      }

      private flattenObjectToStorage(obj: any, baseKey: string): void {
        if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
          localStorage.setItem(this.normalizeKey(baseKey), JSON.stringify(obj))

          return
        }

        for (const [k, v] of Object.entries(obj)) {
          const nextKey = baseKey ? `${baseKey}/${k}` : k

          this.flattenObjectToStorage(v, nextKey)
        }
      }

      private readTreeToObject(prefix: string): any {
        const result: any = {}
        const normalizedPrefix = this.normalizeKey(prefix)

        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (!key) continue

          if (
            key === normalizedPrefix ||
            key.startsWith(normalizedPrefix + '/')
          ) {
            const remainder = key
              .slice(normalizedPrefix.length)
              .replace(/^\/+/, '')

            const parts = remainder ? remainder.split('/') : []
            let cursor = result

            for (let j = 0; j < parts.length - 1; j++) {
              const p = parts[j]
              if (!(p in cursor)) cursor[p] = {}
              cursor = cursor[p]
            }

            const leafKey = parts.length ? parts[parts.length - 1] : '__value__'
            const raw = localStorage.getItem(key)

            if (raw !== null) {
              try {
                cursor[leafKey] = JSON.parse(raw)
              } catch {
                cursor[leafKey] = raw
              }
            }
          }
        }

        if ('__value__' in result) {
          return result['__value__']
        }

        return result
      }

      get length(): number {
        return localStorage.length
      }

      key(index: number): string | null {
        return localStorage.key(index)
      }

      getItem(key: string): string | null {
        const normalized = this.normalizeKey(key)

        const direct = localStorage.getItem(normalized)

        if (direct !== null) {
          return direct
        }

        let hasChild = false

        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i)

          if (k && k.startsWith(normalized + '/')) {
            hasChild = true

            break
          }
        }

        if (hasChild) {
          const obj = this.readTreeToObject(normalized)

          return JSON.stringify(obj)
        }

        return null
      }

      setItem(key: string, value: string): void {
        const parsed = JSON.parse(value)

        this.flattenObjectToStorage(parsed, key)
      }

      removeItem(key: string): void {
        const normalized = this.normalizeKey(key)

        if (localStorage.getItem(normalized) !== null) {
          localStorage.removeItem(normalized)

          return
        }

        const toDelete: string[] = []

        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i)

          if (k && (k === normalized || k.startsWith(normalized + '/'))) {
            toDelete.push(k)
          }
        }

        for (const k of toDelete) {
          localStorage.removeItem(k)
        }
      }

      clear(): void {
        localStorage.clear()
      }
    })()

    super(
      system,
      ID_LOCAL_OBJECT,
      'object',
      objectStorage,
      (value: any) => JSON.stringify(value),
      (value: string) => JSON.parse(value)
    )
  }
}
