<template>
<div id="tenant_layout" v-on:click="handleClick">
      <div class="vnf">VNF: {{model.vnf}}</div>
      <div class="tenant">Tenant: {{model.tenant.name}}</div>
      <div class="version">Version: {{model.version}}</div>
      <div class="date">Timestamp: {{view.now}}</div>
      <tenant_network
        v-for="(network, index) in model.networks"
        :key="'network-' + index"
        v-bind:model="model"
        v-bind:view="view"
        v-bind:network="network"
        v-bind:index="index"></tenant_network>
      <tenant_network2
        :key="'network-dummy'"
        v-bind:model="model"
        v-bind:view="view"></tenant_network2>
      <tenant_component
        v-for="(component, index) in model.components"
        :key="'component-' + index"
        v-bind:model="model"
        v-bind:view="view"
        v-bind:component="component"
        v-bind:index="index"></tenant_component>
      <tenant_component2
        :key="'component-dummy'"
        v-bind:model="model"
        v-bind:view="view"></tenant_component2>
    </div>
</template>
<script>
export default {
    props:    ['model','view'],
    methods: {
      handleClick: function(e) {
        var element = document.getElementById("tenant_layout")

        var x = element.scrollLeft + e.pageX - PXOFFSET - XOFFSET;
        var y = element.scrollTop  + e.pageY - PYOFFSET - YOFFSET;

        var net_index = Math.floor(x/XSLOT);
        var cmp_index = Math.floor(y/YSLOT);

        // check if click was in the cross-section of a network and a component
        if ( 0 <= net_index && net_index < this.model.networks.length &&
             0 <= cmp_index && cmp_index < this.model.components.length ) {

          // determine network and component
          var net = this.model.networks[net_index];
          var cmp = this.model.components[cmp_index];

          // delete interface if component has an interface to that network
          var iface = hasComponentInterface(cmp,net.name)
          if (iface) {
            delComponentInterface(cmp,iface)
          } else {
            addComponentInterface(cmp,net.name)
          }
        }
      }
    }
}
</script>