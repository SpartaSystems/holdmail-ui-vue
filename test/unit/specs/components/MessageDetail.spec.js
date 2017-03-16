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

import MessageDetail from '@/components/MessageDetail'
import messagesApi from '@/api/messages'
import message1 from '../../api-mocks/message-detail-1'
import message2 from '../../api-mocks/message-detail-2'

var getComponent = generateComponentMounter(MessageDetail)

function stubForwardMessageSuccess (messages) {
  const resolved = new Promise((resolve, reject) => resolve())

  return sinon.stub(messagesApi, 'forwardMessage')
    .returns(resolved)
}

describe('MessageDetail.vue', () => {
  var comp

  describe('Rendering', () => {
    it('displays the message subject in the modal header', () => {
      comp = getComponent({message: message1})

      var title = comp.$el.querySelector('.modal-title')

      expect(title.textContent).to.equal('TEST')
    })

    it('displays three tabs', (done) => {
      comp = getComponent({message: message2})

      setTimeout(function () {
        var tabs = comp.$el.querySelectorAll('.tabs .nav-tabs .nav-item')

        expect(tabs[0].querySelector('a').textContent).to.equal('Original Message')
        expect(tabs[1].querySelector('a').textContent).to.equal('HTML Body')
        expect(tabs[2].querySelector('a').textContent).to.equal('Text Body')

        done()
      }, 0)
    })

    it('if no message body html, disables the tab', (done) => {
      comp = getComponent({message: message1})

      comp.$nextTick(() => {
        var tabs = comp.$el.querySelectorAll('.tabs .nav-tabs .nav-link')

        expect(tabs[1].classList.contains('disabled')).to.be.true

        done()
      })
    })

    it('if no message body text, disables the tab', (done) => {
      comp = getComponent({message: message1})

      comp.$nextTick(() => {
        var tabs = comp.$el.querySelectorAll('.tabs .nav-tabs .nav-link')

        expect(tabs[2].classList.contains('disabled')).to.be.true

        done()
      })
    })
  })

  describe('Behavior', () => {
    it('manually hides the validation popover on modal hide', () => {
      comp = getComponent({message: message2})

      var stub = sinon.stub(comp.$refs.valPopover, 'hidePopover')

      comp.$root.$emit('hidden::modal', 'modal1')

      expect(stub.calledOnce).to.be.true
    })

    describe('Forwarding', () => {
      it('can forward an email to another address', (done) => {
        var stub = stubForwardMessageSuccess()

        comp = getComponent({message: message2})
        comp.forwardRecipient = 'test@test.com'

        comp.$nextTick(() => {
          var forwardInput = comp.$el.querySelector('#forwardRecipientTxt')
          expect(forwardInput.value).to.equal('test@test.com')

          triggerEvent(comp, '#forwardBut', 'click')

          expect(stub.calledWith(63, 'test@test.com'))

          setTimeout(function () {
            var alert = comp.$el.querySelector('#forward-alert')

            expect(alert.textContent.trim()).to.equal('Mail 63 successfully sent to test@test.com')

            stub.restore()
            done()
          }, 0)
        })
      })

      describe('Validation', () => {
        it('displays error message if not a valid email', (done) => {
          comp = getComponent({message: message2})
          comp.forwardRecipient = 'not valid email'

          comp.$nextTick(() => {
            var popup = comp.$el.querySelector('.popover-content-wrapper span')

            expect(popup.textContent).to.equal('The forwardEmail field must be a valid email.')

            done()
          })
        })
      })
    })
  })
})
