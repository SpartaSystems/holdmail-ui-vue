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
  <div id="app">
    <b-navbar class="bg-faded pt-0 pb-0" toggleable>
      <b-nav-toggle target="nav_collapse"/>
      <a class="navbar-brand" to="/">
          <img src="./assets/holdmail-header-logo.png" alt="HoldMail Logo" title="HoldMail Home" height="40">
      </a>
      <b-collapse is-nav id="nav_collapse">
          <b-nav is-nav-bar class="ml-auto">
              <b-nav-item href="https://github.com/spartasystems/holdmail-vue-ui">
                <i class="holdmail-nav-link fa fa-github"></i> GitHub
              </b-nav-item>
          </b-nav>
      </b-collapse>
    </b-navbar>
    <div class="container">
      <div class="row">
        <message-table></message-table>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import MessageTable from '@/components/MessageTable'

Vue.use(BootstrapVue)

export default {
  name: 'app',
  components: { MessageTable }
}
</script>
