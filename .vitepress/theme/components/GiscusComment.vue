<script setup lang="ts">
import { onMounted, nextTick } from 'vue'

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
  script.setAttribute('data-theme', 'transparent_dark')
  script.setAttribute('data-lang', 'zh-CN')
  script.setAttribute('crossorigin', 'anonymous')
  script.async = true

  container.appendChild(script)
}

onMounted(() => {
  nextTick(() => loadGiscus())
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
  border: 1px solid #2a2a2a;
  border-radius: 14px;
  background: #111;
}

.comments-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #f0f0f0;
}
</style>
