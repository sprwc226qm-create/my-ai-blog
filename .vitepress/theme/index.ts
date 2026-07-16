import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import GiscusComment from './components/GiscusComment.vue'
import HomePosts from './components/HomePosts.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-after': () => h(HomePosts),
      'doc-after': () => h(GiscusComment),
    })
  },
}
