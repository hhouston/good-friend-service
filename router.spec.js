import test from 'ava'
import nock from 'nock'

test.beforeEach(async (t) => {
  nock.disableNetConnect()

  t.context.language = 'en'
})
