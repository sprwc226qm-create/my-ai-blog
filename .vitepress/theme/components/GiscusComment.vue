<script setup lang="ts">
import { onMounted, watch, nextTick } from 'vue'
import { useData } from 'vitepress'

const { isDark } = useData()

function loadGiscus() {
  const container = document.getElementById('giscus-container')
  if (!container) return
  container.innerHTML = ''

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', 'sprwc226qm-create/my-ai-blog')
  script.setAttribute('data-repo-id', 'R_kgDOTaKpYQ')
  script.setAttribute('data-category', 'General')
  script.setAttribute('data-category-id', 'DIC_kwDOTaKpYc4DBTxO')
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'bottom')
  script.setAttribute('data-theme', isDark.value ? 'transparent_dark' : 'light')
  script.setAttribute('data-lang', 'zh-CN')
  script.setAttribute('crossorigin', 'anonymous')
  script.async = true

  container.appendChild(script)
}

onMounted(() => {
  nextTick(() => loadGiscus())
})

watch(isDark, () => {
  loadGiscus()
})
</script>

<template>
  <div class="giscus-wrapper">
    <h2 id="comments" class="comments-title">💬 评论</h2>
    <div id="giscus-container"></div>
  </div>
</template>

<style scoped>
.giscus-wrapper {
  margin-top: 48px;
  padding: 32px 24px;
  border-radius: 14px;
}

:root:not(.dark) .giscus-wrapper {
  background: #FFFFFF;
  border: 1px solid #F0DED8;
}

.dark .giscus-wrapper {
  background: #111;
  border: 1px solid #2a2a2a;
}

.comments-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

:root:not(.dark) .comments-title {
  color: #4A3F3F;
}

.dark .comments-title {
  color: #f0f0f0;
}
</style>
