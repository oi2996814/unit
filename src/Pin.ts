import { EventEmitter, EventEmitter_EE } from './EventEmitter'
import { isPrimitive } from './spec/primitive'
import { V } from './types/interface/V'

export type PinEvent =
  | 'data'
  | 'drop'
  | 'invalid'
  | 'start'
  | 'end'
  | 'constant'
  | 'ignored'

export type Pin_EE<T> = {
  data: [T]
  pull: []
  drop: [T]
  start: []
  end: []
  invalid: []
  ignored: [boolean]
  constant: [boolean]
}

export type Pin_M<T = any> = {
  _register: T | undefined
  _invalid: boolean
  _constant: boolean
  _ignored: boolean
  _idle: boolean
}

export type PinEvents<T> = EventEmitter_EE<Pin_EE<T>> & Pin_EE<T>

export class Pin<T = any> extends EventEmitter<PinEvents<T>> implements V {
  private _constant: boolean = false
  private _ignored: boolean = false

  private _invalid: boolean = false

  private _idle: boolean = true

  protected _register: T | undefined = undefined

  constructor({
    data,
    constant,
    ignored,
  }: {
    data?: any
    constant?: boolean
    ignored?: boolean
  } = {}) {
    super()

    if (data !== undefined) {
      this._idle = false
    }
    this._register = data

    this._constant = constant || false
    this._ignored = ignored || false
  }

  public take(): T | undefined {
    const data = this._register
    if (this._register !== undefined) {
      this._register = undefined
      this.emit('drop', data)
    }
    this.end()
    return data
  }

  public invalidate() {
    if (this._register !== undefined && !this._invalid) {
      this._invalid = true
      this._idle = true
      this.emit('invalid')
    }
  }

  public start() {
    if (this._idle) {
      this._idle = false
      this.emit('start')
    }
  }

  public end() {
    if (this._register === undefined && !this._idle) {
      this._idle = true
      this.emit('end')
    }
  }

  public pull(): T | undefined {
    const data = this._register
    if (data !== undefined) {
      if (this._constant) {
        this.emit('data', data)
      } else {
        this.take()
      }
    }
    return data
  }

  public push(data: T): void {
    this.invalidate()
    this._invalid = false
    this.start()
    this._register = data
    this.emit('data', data)
    if (this._ignored) {
      this.take()
    }
  }

  public peak(): T | undefined {
    return this._register
  }

  public empty(): boolean {
    return this._register === undefined
  }

  public active(): boolean {
    return !this.empty()
  }

  public ignored(value?: boolean, take: boolean = true): boolean {
    if (value !== undefined) {
      this._ignored = value
      if (take) {
        if (this._ignored && !this._constant) {
          this.take()
        }
      }
      this.emit('ignored', this._ignored)
    }
    return this._ignored
  }

  public constant(value?: boolean): boolean {
    if (value !== undefined) {
      this._constant = value
    }
    return this._constant
  }

  public invalid(): boolean {
    return this._invalid
  }

  public snapshot(): Pin_M<T> {
    return {
      _register: isPrimitive(this._register) ? this._register : undefined,
      _invalid: this._invalid,
      _constant: this._constant,
      _ignored: this._ignored,
      _idle: this._idle,
    }
  }

  public restore(state: Pin_M<T>): void {
    const { _register, _invalid, _constant, _ignored, _idle } = state

    this._register = _register
    this._invalid = _invalid
    this._constant = _constant
    this._ignored = _ignored
    this._idle = _idle
  }

  // V

  async read(): Promise<any> {
    if (this._register === undefined) {
      throw new Error('empty')
    }
    return this._register
  }

  async write(data: any): Promise<void> {
    this.push(data)
  }
}
