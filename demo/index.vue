<template>
  <demo-sort :cols="1">
    <Basic />
    <Edit />
    <Sever />
  </demo-sort>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import CN from '../index.md'
import Basic from './basic.vue'
import Edit from './edit.vue'
import Sever from './sever.vue'

export default defineComponent({
  CN,
  components: {
    Basic,
    Edit,
    Sever,
  },
})
</script>
