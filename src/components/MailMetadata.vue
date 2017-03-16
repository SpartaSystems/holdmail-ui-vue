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
  <dl class="mail-metadata row mt-3">
    <dt class="col-sm-3">From</dt>
    <dd class="sender col-sm-9">{{ message.senderEmail }}</dd>
    <dt class="col-sm-3">Recipient(s)</dt>
    <dd class="recipients ccol-sm-9">{{ message.recipients }}</dd>
    <dt class="col-sm-3">Sent</dt>
    <dd class="received-date col-sm-9">{{ receivedDate | date('%b %-d, %Y %r') }}</dd>
  </dl>
</template>

<script>
import Vue from 'vue'
import filters from 'vue-filter'

Vue.use(filters)

export default {
  name: 'mail-metadata',
  props: {
    message: {
      type: Object,
      default: {},
      required: true
    }
  },
  computed: {
    receivedDate () {
      // otherwise filter will freak out if receivedDate is null/undefined
      return this.message && this.message.receivedDate || 0
    }
  }
}
</script>
