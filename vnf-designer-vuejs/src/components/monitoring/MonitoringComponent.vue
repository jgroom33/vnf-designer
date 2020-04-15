<template>
      <div
        :class="'component monitoring_component index' + index"
        :id="'monitoring_component_' + name"
        :style="{
          top:    t + 'px',
          left:   l + 'px',
          width:  w + 'px',
          height: h + 'px'
        }">
        <div class="name">{{name}}</div>
        <div class="icon"><i class="fas fa-server"/></div>
        <monitoring_port
          v-for="(interFace, subindex) in component.component.interFaces"
          :key="subindex"
          :model="model"
          :view="view"
          :component="component.component"
          :interFace="interFace"
          :name="name"
          :index="index"
          :subindex="subindex"></monitoring_port>
      </div>
</template>
<script>
export default {
    props:   ['model','view','component','name','index'],
    computed: {
      t: function() {
        return DY+NET_HEIGHT + this.index * (DY+CMP_HEIGHT2);
      },
      l: function(index) {
        return DX;
      },
      w: function() {
        return CMP_WIDTH
      },
      h: function() {
        return CMP_HEIGHT2
      },
      z: function() {
        return this.component.placement.substr(0,1).toUpperCase();
      }
    }
}
</script>