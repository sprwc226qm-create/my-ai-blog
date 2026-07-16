<script setup lang="ts">
import { onMounted, watch, nextTick } from 'vue'
import { useData } from 'vitepress'

const { isDark, frontmatter } = useData()

function loadGiscus() {
  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', 'sprwc226qm-create/my-ai-blog')
  script.setAttribute('data-repo-id', 'REPO_ID')
  script.setAttribute('data-category', 'Announcements')
  script.setAttribute('data-category-id', 'CATEGORY_ID')
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'top')
  script.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  script.setAttribute('data-lang', 'zh-CN')
  script.setAttribute('crossorigin', 'anonymous')
  script.async = true

  const container = document.getElementById('giscus-container')
  if (container) {
    container.innerHTML = ''
    container.appendChild(script)
  }
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
  padding-top: 32px;
  border-top: 1px solid var(--vp-c-divider);
}

.comments-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}
</style>
