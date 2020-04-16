<template>
    <div id="monitoring">
      <div class="vnf" @click="refresh">VNF: {{model.vnf}}</div>
      <div class="version">Version: {{model.version}}</div>
      <div class="tenant">Tenant: {{model.tenant.name}}</div>
      <div class="date">Timestamp: {{view.now}}</div>
      <div class="indicator"><i class="fas fa-heartbeat"/></div>
      <monitoring_network
        v-for="(network, index) in model.networks"
        :key="'network-' + index"
        :model="model"
        :view="view"
        :network="network"
        :index="index"></monitoring_network>
      <monitoring_component
        v-for="(component, index) in components"
        :key="'component-' + component.index"
        :model="model"
        :view="view"
        :component="component"
        :name="component.name"
        :index="index"></monitoring_component>
    </div>
</template>
<script>
export default {
    props:    ['model','view'],
    components: {
      monitoring_network: () => import('./MonitoringNetwork'),
      monitoring_component: () => import('./MonitoringComponent')
    },
    methods: {
      refresh: function() {
        var self    = this
        var request = new XMLHttpRequest();

        // callback function to process the results
        refreshCB: () => {
          // hide loading indicator
          let indicator = document.querySelector("#monitoring .indicator")
          indicator.style.display = "none"

          if (this.readyState == 4) {
            // update in 10 seconds
            if (this.view.detail == "Monitoring") {
              setTimeout(function(){self.refresh()}, 10000)
            }

            // check status
            if (this.status != 200) {
              return
            }

            inventory = jsyaml.safeLoad(request.responseText)

            // reset all networks, components and ports
            elements = document.querySelectorAll(".monitoring_network")
            for (var element of elements) {
              element.querySelector(".icon").style.color = null
              element.querySelector("input").style.color = null
            }

            elements = document.querySelectorAll(".monitoring_component")
            for (var element of elements) {
              element.querySelector(".icon").style.color = null
              element.querySelector(".name").style.color = null
            }

            elements = document.querySelectorAll(".monitoring_port")
            for (var element of elements) {
              element.style.color = null
            }

            // update network status
            for (var network of inventory.networks) {
              element = document.querySelector("#monitoring_network_" + network.name)
              if (element) {
                if (network.status == "ACTIVE") {
                  element.querySelector(".icon").style.color = "green"
                  element.querySelector("input").style.color = "green"
                } else {
                  element.querySelector(".icon").style.color = "red"
                  element.querySelector("input").style.color = "red"
                }
              }
            }
            // update server status
            for (var server of inventory.servers) {
              element = document.querySelector("#monitoring_component_" + server.name)
              if (element) {
                if (server.status == "ACTIVE") {
                  element.querySelector(".icon").style.color = "green"
                  element.querySelector(".name").style.color = "green"
                } else {
                  element.querySelector(".icon").style.color = "red"
                  element.querySelector(".name").style.color = "red"
                }
              }
            }
            // update port status
            for (var port of inventory.ports) {
              element = document.querySelector("#monitoring_port_" + port.name)
              if (element) {
                element.style.color = (port.status == "ACTIVE" ? "green" : "red")
              }
            }
          }
        }

        // check if the webpage has been loaded from file
        if (window.location.hostname == "") {
          return
        }

        // issue request to server backend
        request.onreadystatechange = refreshCB

        var params  = "tenant="   + this.model.tenant.name          + "&" +
                      "url="      + this.model.tenant.auth.url      + "&" +
                      "username=" + this.model.tenant.auth.username + "&" +
                      "password=" + this.model.tenant.auth.password

        request.open('GET', '/inventory', true);  // asynchronous request
        request.send(params);

        // switch indicator
        let indicator = document.querySelector("#monitoring .indicator")
        indicator.style.display = "unset"
      }
    },
    computed: {
      components: function() {
        var result = []
        var index  = 0

        for (var index in this.model.components) {
          let component = this.model.components[index]

          if (component.max == 1) {
            result.push({index: index, name: component.name, component: component })
            index++
          } else {
            for (var i=0; i<=component.max; i++) {
              result.push({index: index, name: component.name + "-" + String(i), component: component })
              index++
            }
          }
        }

        // get status on next tick
        this.$nextTick(this.refresh)

        return result
      }
    }
}
</script>