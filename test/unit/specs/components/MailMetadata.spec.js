/*******************************************************************************
 * Copyright 2017 Sparta Systems, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

import MailMetadata from '@/components/MailMetadata'
import message2 from '../../api-mocks/message-detail-2'

var getComponent = generateComponentMounter(MailMetadata)

describe('MailMetadata.vue', () => {
  var comp

  it('rendering mail metadata', (done) => {
    comp = getComponent({message: message2})

    comp.$nextTick(() => {
      var sender = comp.$el.querySelector('.sender')
      var recipients = comp.$el.querySelector('.recipients')
      var receivedDate = comp.$el.querySelector('.received-date')

      expect(sender.textContent).to.equal('test@test.com')
      expect(recipients.textContent).to.equal('test@test.com')
      expect(receivedDate.textContent).to.equal('Mar 31, 2017 09:26:11 AM')

      done()
    })
  })

  it('receivedDate returns 0 if message data is undefined', () => {
    comp = getComponent({message: {}})

    expect(comp.receivedDate).to.equal(0)
  })
})
