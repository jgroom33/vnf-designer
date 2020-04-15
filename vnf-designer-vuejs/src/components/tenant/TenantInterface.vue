<template>
 <div
        v-bind:class="'interface network' + n + ' component' + index"
        v-bind:style="{
          top:    t + 'px',
          left:   l + 'px',
          width:  w + 'px',
          height: h + 'px',
        }"
        v-bind:title="a">
        <div class="serverport"></div>
        <div class="switchport"></div>
      </div>
</template>
<script>
export default {
    props:   ['model','view','component','interface','index','subindex'],
    computed: {
      t: function() {
        return (this.subindex+1) * CMP_HEIGHT/(this.component.interfaces.length + 1)
      },
      l: function() {
        return CMP_WIDTH;
      },
      w: function() {
        for ( var i = 0; i < this.model.networks.length; i++ )
        {
          if (this.interface.network === this.model.networks[i].name) {
            return i * (DX+NET_WIDTH) + NET_WIDTH
          }
        }

        return 0
      },
      h: function() {
        return 1
      },
      n: function() {
        for ( var i = 0; i < this.model.networks.length; i++ )
        {
          if (this.interface.network === this.model.networks[i].name) {
            return i
          }
        }

        return 0
      },
      a: function() {
        return this.interface.network + (this.interface.attributes != "" ? ": " + this.interface.attributes : "")
      }
    }
}
</script>