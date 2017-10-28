import Vue from 'vue'
import Router from 'vue-router'
import MessageTable from '@/components/MessageTable'
import MessageDetail from '@/components/MessageDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MessageTable',
      component: MessageTable
    },
    { path: '/view/:messageId',
      name: 'MessageDetail',
      component: MessageDetail
    },
    { path: '*',
      redirect: '/'
    }
  ]
})
