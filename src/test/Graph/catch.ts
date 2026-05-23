import assert from 'assert'
import { Graph } from '../../Class/Graph'
import { SELF } from '../../constant/SELF'
import { watchGraphAndLog, watchUnitAndLog } from '../../debug'
import { ID_CATCH, ID_THROW } from '../../system/_ids'
import { system } from '../util/system'

const spec = system.emptySpec()

const graph = new Graph(spec, {}, system)

0 && watchUnitAndLog(graph)
0 && watchGraphAndLog(graph)

graph.play()

graph.addUnitSpec('throw', { unit: { id: ID_THROW } })
graph.addUnitSpec('catch', { unit: { id: ID_CATCH } })

const catchy = graph.getUnit('catch')
const throwy = graph.getUnit('throw')

throwy.pushInput('message', 'booom!')

assert.equal(throwy.peakInput('message'), 'booom!')
assert.equal(throwy.getErr(), 'booom!')

graph.addMerge(
  {
    throw: {
      output: {
        [SELF]: true,
      },
    },
    catch: {
      input: {
        unit: true,
      },
    },
  },
  '0'
)

assert.equal(catchy.peakOutput('err'), 'booom!')
assert.equal(throwy.peakInput('message'), 'booom!')

assert.equal(catchy.takeOutput('err'), 'booom!')
assert.equal(throwy.peakInput('message'), undefined)

throwy.pushInput('message', 'puff!')

assert.equal(catchy.peakOutput('err'), 'puff!')

graph.removeMerge('0')

assert.equal(catchy.peakOutput('err'), undefined)
assert.equal(throwy.getErr(), 'puff!')

graph.addMerge(
  {
    throw: {
      output: {
        [SELF]: true,
      },
    },
    catch: {
      input: {
        unit: true,
      },
    },
  },
  '0'
)

assert.equal(catchy.peakOutput('err'), 'puff!')
assert.equal(throwy.peakInput('message'), 'puff!')
assert.equal(throwy.getErr(), 'puff!')
assert.equal(graph.getErr(), null)

throwy.setInputConstant('message', true)

assert.equal(catchy.takeOutput('err'), 'puff!')
assert.equal(catchy.takeOutput('err'), 'puff!')
assert.equal(catchy.takeOutput('err'), 'puff!')
assert.equal(catchy.takeOutput('err'), 'puff!')
assert.equal(catchy.takeOutput('err'), 'puff!')

throwy.setInputConstant('message', false)

assert.equal(catchy.takeOutput('err'), 'puff!')
assert.equal(catchy.takeOutput('err'), null)

throwy.push('message', 'xxx')

assert.equal(catchy.peakOutput('err'), 'xxx')

assert.equal(throwy.takeInput('message'), 'xxx')

assert.equal(catchy.peakOutput('err'), null)
