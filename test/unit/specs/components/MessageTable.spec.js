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

import messagesApi from '@/api/messages'
import MessageTable from '@/components/MessageTable'

import msgs from '../../api-mocks/message-list'
import messageDetail from '../../api-mocks/message-detail-1'

var getComponent = generateComponentMounter(MessageTable)

// because Vue.js caches their constructors, one needs to remove
// the cached constructor when stubbing Module functions (similar to prototypes)
// so that the next test does not inherit the cached module that has a stubbed
// function
function deleteModuleCtorCache () {
  delete MessageTable._Ctor
}

function stubMessageList () {
  return sinon.stub(messagesApi, 'getMessageList').returns(new Promise(() => {}))
}

function stubMessageListSuccess (messages) {
  const d = {
    data: { messages }
  }
  const resolved = new Promise((resolve, reject) => resolve(d))

  return sinon.stub(messagesApi, 'getMessageList')
    .returns(resolved)
}

function stubMessageDetailSuccess (details) {
  const d = {
    data: details
  }
  const resolved = new Promise((resolve, reject) => resolve(d))

  return sinon.stub(messagesApi, 'getMessageDetail')
    .returns(resolved)
}

describe('MessageTable.vue', () => {
  var comp

  describe('Lifecycle', () => {
    it('fetches messages on mount', () => {
      deleteModuleCtorCache()

      const stub = sinon.stub(MessageTable.methods, 'clearAndFetchMessages')

      getComponent()

      expect(stub.calledOnce).to.be.ok

      stub.restore()

      deleteModuleCtorCache()
    })
  })

  describe('Rendering', () => {
    it('if no messages, display empty messages pane', (done) => {
      var stub = stubMessageListSuccess(msgs)

      comp = getComponent()

      setTimeout(function () {
        expect(comp.$el.querySelector('.card').style.display).to.equal('none')

        stub.restore()

        stub = stubMessageListSuccess([])

        comp.clearAndFetchMessages()

        setTimeout(function () {
          var card = comp.$el.querySelector('.card')
          expect(card.style.display).to.equal('')
          expect(card.querySelector('.card-title').textContent).to.equal('No Messages')
          expect(card.querySelector('.card-text').textContent).to.equal('No messages found for the current criteria - Try sending some to the mail server!')

          stub.restore()

          done()
        }, 0)
      }, 0)
    })

    it('renders list of messages', (done) => {
      var stub = stubMessageListSuccess(msgs)

      comp = getComponent()

      setTimeout(function () {
        var messages = comp.$el.querySelectorAll('#mailResults table tbody tr')

        expect(messages.length).to.equal(2)
        expect(messages[0].querySelector('.item-id').textContent).to.equal('57')
        expect(messages[0].querySelector('.item-received-date').textContent).to.equal('Mar 20, 2017 02:40:47 PM')
        expect(messages[0].querySelector('.item-sender-mail').textContent).to.equal('holdmail@spartasystems.com')
        expect(messages[0].querySelector('.item-recipients').textContent).to.equal('test@test.com')
        expect(messages[0].querySelector('.item-subject').textContent).to.equal('TEST')
        expect(messages[1].querySelector('.item-id').textContent).to.equal('58')
        expect(messages[1].querySelector('.item-received-date').textContent).to.equal('Mar 20, 2017 02:40:47 PM')
        expect(messages[1].querySelector('.item-sender-mail').textContent).to.equal('holdmail@spartasystems.com')
        expect(messages[1].querySelector('.item-recipients').textContent).to.equal('test@test.com')
        expect(messages[1].querySelector('.item-subject').textContent).to.equal('TEST')

        stub.restore()

        done()
      }, 0)
    })

    it('displays progress bar while busy fetching messages', (done) => {
      deleteModuleCtorCache()

      // stub out mounted() function it calls MessageTable.clearAndFetchMessages()
      // and messes with the timing of this test (would fire clearAndFetchMessages() twice,
      // making the MessageTable.busy true at the time of test)
      var mountedStub = sinon.stub(MessageTable, 'mounted')
      var stub = stubMessageList()

      comp = getComponent()

      expect(comp.$el.querySelector('.progress').style.display).to.equal('none')

      comp.clearAndFetchMessages()

      comp.$nextTick(() => {
        expect(comp.busy).to.be.true
        expect(comp.$el.querySelector('.progress').style.display).to.equal('')

        stub.restore()
        mountedStub.restore()

        deleteModuleCtorCache()

        done()
      })
    })
  })

  describe('Behavior', () => {
    describe('Searching', () => {
      it('search is initiated on enter key of search field', () => {
        var stub = stubMessageListSuccess(msgs)

        comp = getComponent()

        var clearFetchStub = sinon.stub(comp, 'clearAndFetchMessages')

        triggerEvent(comp, '#mainSearchTxt', 'keyup', 13)

        expect(clearFetchStub.calledOnce).to.be.ok

        stub.restore()
      })

      it('search is initiated on clicking search button', (done) => {
        var stub = stubMessageListSuccess(msgs)

        comp = getComponent()

        var clearFetchStub = sinon.stub(comp, 'clearAndFetchMessages')

        comp.$nextTick(function () {
          triggerEvent(comp, '#mainSearchBut', 'click')

          expect(clearFetchStub.callCount).to.equal(1)

          stub.restore()

          done()
        })
      })

      it('can filter search results by email', (done) => {
        var stub = stubMessageListSuccess(msgs)

        deleteModuleCtorCache()

        var mountedStub = sinon.stub(MessageTable, 'mounted')

        comp = getComponent()

        comp.recipientEmail = 'test@test.com'

        comp.$nextTick(() => {
          expect(comp.$el.querySelector('#mainSearchTxt').value).to.equal('test@test.com')

          triggerEvent(comp, '#mainSearchBut', 'click')

          setTimeout(function () {
            expect(stub.calledWith(40, 0, 'test@test.com')).to.be.true

            stub.restore()
            mountedStub.restore() // restoring mounted()

            deleteModuleCtorCache()

            done()
          }, 0)
        })
      })
    })

    it('prevents simultaneous fetches of message list', () => {
      var stub = stubMessageList()

      comp = getComponent() // clearAndFetchMessages() called during mount lifecycle phase

      expect(comp.busy).to.be.true // component is already busy now

      comp.clearAndFetchMessages() // attempt a simulatenous fetch

      expect(stub.callCount).to.equal(1) // message list fetch only called once

      stub.restore()
    })

    it('row click displays message details', (done) => {
      var listStub = stubMessageListSuccess(msgs)
      var detailStub = stubMessageDetailSuccess(messageDetail)

      comp = getComponent()

      sinon.stub(comp.$root, '$emit')

      setTimeout(function () {
        triggerEvent(comp, '#mailResults table tbody tr:first-child', 'click')

        expect(detailStub.callCount).to.equal(1)

        setTimeout(function () {
          expect(comp.selectedMail).to.equal(messageDetail)
          expect(comp.$root.$emit.calledWith('show::modal', 'modal1')).to.be.true

          listStub.restore()
          detailStub.restore()

          done()
        }, 0)
      }, 0)
    })
  })
})
