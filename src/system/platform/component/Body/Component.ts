import HTMLElement_ from '../../../../client/html'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'

export interface Props {
  style?: Dict<string>
  attr?: Dict<string>
}

export default class Body extends HTMLElement_<HTMLBodyElement, Props> {
  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElement('body'),
      $system.style['body'],
      {},
      {}
    )
  }
}
