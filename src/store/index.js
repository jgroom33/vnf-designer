import Vue from 'vue'
import Vuex from 'vuex'
import { getField, updateField } from 'vuex-map-fields';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedModeview: 'openstack',
    modeviews: {
      openstack: 'Openstack',
      etsi_mano: 'ETSI/MANO'
    }
  },
  mutations: {
    updateField
  },
  actions: {
  },
  modules: {
  },
  getters: {
    getField
  },
})