<template>
      <div
        :class="'port monitoring_port network' + i"
        :id="'monitoring_port_' + name + '_' + interFace.network"
        :title="name + ':' + interFace.network + a "
        :style="{
          top:    t + 'px',
          left:   l + 'px',
          width:  w + 'px',
          height: h + 'px',
          'line-height': h + 'px'
        }"><i class="fa fa-bullseye"/>
      </div>
</template>
<script>
export default {
    props:   ['model','view','component','interFace', 'name','index', 'subindex'],
    computed: {
      t: function() {
        return 0;
      },
      l: function() {
        return CMP_WIDTH + (this.i) * (DX+NET_WIDTH) + NET_WIDTH/2 -0.5;
      },
      w: function() {
        return NET_WIDTH
      },
      h: function() {
        return CMP_HEIGHT2
      },
      i: function() {
        for (var index2=0; index2 < this.model.networks.length; index2++) {
          if (this.interFace.network == this.model.networks[index2].name) {
            return index2
          }
        }

        return this.model.networks.length;
      },
      a: function() {
        return (this.interFace.attributes == "" ? "" : ' (' + this.interFace.attributes + ')')
      }
    }
}
</script>