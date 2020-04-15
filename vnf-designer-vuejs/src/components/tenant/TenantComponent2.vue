<template>
    <div
        class="component dummy"
        v-on:click="handleClick"
        v-bind:style="{
          top:    t + 'px',
          left:   l + 'px',
          width:  w + 'px',
          height: h + 'px'
        }">
        <div class="'zone zone-O'"></div>
        <div class="icon"><i class="fas fa-server"/></div>
        <div class="name">new component</div>
        <div class="sizing"></div>
      </div>
</template>
<script>
export default {
    props:   ['model','view'],
    methods: {
      handleClick: function() {addComponent()}
    },
    computed: {
      t: function() {
        return DY+NET_HEIGHT + this.model.components.length * (DY+CMP_HEIGHT);
      },
      l: function() {
        return DX
      },
      w: function() {
        return CMP_WIDTH
      },
      h: function() {
        return CMP_HEIGHT
      }
    }
}
</script>