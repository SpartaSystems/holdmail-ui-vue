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

<template>
  <b-modal id="modal1" :title="message.subject" size="lg">
      <b-alert id="forward-alert" :show="dismissCountDown" variant="success" @dismiss-count-down="countDownChanged">
        Mail {{ message.messageId }} successfully sent to <strong>{{ forwardRecipient }}</strong>
      </b-alert>
      <b-tabs :no-fade="true" ref="tabs">
        <b-tab id="original-message" title="Original Message">
          <div class="mail-summary-content mail-summary-content-pre mail-summary-content-raw">{{ message.messageRaw }}</div>
        </b-tab>
        <b-tab id="html-body" title="HTML Body" :disabled="!message.messageHasBodyHTML">
            <mail-metadata :message="message"></mail-metadata>
            <iframe class="mail-summary-content mail-summary-content-html" :srcdoc="message.messageBodyHTML"></iframe>
        </b-tab>
        <b-tab id="html-text" title="Text Body" :disabled="!message.messageHasBodyText">
            <mail-metadata :message="message"></mail-metadata>
            <div class="mail-summary-content mail-summary-content-pre mail-summary-content-raw">{{message.messageBodyText}}</div>
        </b-tab>
      </b-tabs>
      <div slot="modal-footer" :class="{ 'input-group': true, 'has-danger': errors.any() }">
        <input id="forwardRecipientTxt" type="email" class="form-control"
          name="forwardEmail"
          v-model="forwardRecipient"
          v-validate="'email'"
          placeholder="Forward To: e.g. homer@simpson.com"
          :disabled="busyForwarding"
          required>
        <span class="input-group-btn pl-2">
          <b-popover ref="valPopover"
            :triggers="false"
            :content="errors && errors.first('forwardEmail')"
            :show="errors.any()">
            <button id="forwardBut" class="btn btn-primary" type="button"
              @click="forwardMail"
              :disabled="errors.any() || forwardRecipient === '' || busyForwarding">
                <span v-if="!busyForwarding">
                  Forward
                  <i class="fa fa-forward" aria-hidden="true"></i>
                </span>
                <i v-if="busyForwarding" class="fa fa-spinner fa-pulse fa-fw"></i>
            </button>
          </b-popover>
        </span>
      </div>
    </b-modal>
</template>

<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import BootstrapVue from 'bootstrap-vue'
import messagesApi from '@/api/messages'
import MailMetadata from '@/components/MailMetadata'

Vue.use(BootstrapVue)
Vue.use(VeeValidate)

export default {
  name: 'message-detail',
  components: { MailMetadata },
  props: {
    'message': {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      dismissCountDown: null,
      busyForwarding: false,
      forwardRecipient: '',
      messageHTML: ''
    }
  },
  mounted () {
    // auto-hide popover (https://github.com/bootstrap-vue/bootstrap-vue/issues/151)
    this.$root.$on('hidden::modal', (id) => {
      /* istanbul ignore else */
      if (id === 'modal1') {
        this.$refs.valPopover.hidePopover()
      }
    })
  },
  watch: {
    message () {
      if (this.message.messageHasBodyHTML) {
        this.setTab(1)
      } else {
        this.setTab(0)
      }
    }
  },
  methods: {
    forwardMail () {
      this.busyForwarding = true

      messagesApi.forwardMessage(this.message.messageId, this.forwardRecipient)
        .then((response) => {
          this.busyForwarding = false
          this.dismissCountDown = 5
        })
        .catch(() => {
          console.log('Service failed to forward message to ' + this.forwardRecipient)
        })
    },
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    setTab (index) {
      this.$nextTick(() => {
        this.$refs.tabs.setTab(index, true)
      })
    }
  }
}
</script>

<style>
.mail-details-modal .modal-dialog {
    width :40%;
    height: 90%;
    min-width: 800px;
    min-height: 400px;
}
.mail-summary {
    height: 500px;
    flex-direction: column;
}

.mail-summary-content {
    width: 100%;
    height: 330px;
    border: 1px solid #dddddd;
    padding: 5px;
}

.mail-summary-content-pre {
    background-color: #eeeeee;
    white-space: pre;
    font-family: monospace;
    overflow: auto;
}
</style>
