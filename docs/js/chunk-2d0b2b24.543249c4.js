(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0b2b24"],{"24e1":function(e,t,n){"use strict";n.r(t);var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{class:"network network"+e.index,style:{top:e.t+"px",left:e.l+"px",width:e.w+"px",height:e.h+"px"}},[n("div",{staticClass:"icon",attrs:{title:e.network.name+"\\nipv4: "+e.network.ipv4+"\\nipv6: "+e.network.ipv6},on:{click:e.viewNetwork}},[n("i",{staticClass:"fas fa-network-wired"})]),n("input",{directives:[{name:"model",rawName:"v-model",value:e.network.name,expression:"network.name"}],domProps:{value:e.network.name},on:{change:e.handleChange,input:function(t){t.target.composing||e.$set(e.network,"name",t.target.value)}}})])},o=[],r=n("5629"),a=n("a79f"),s={props:["model","view","network","index"],methods:{handleChange:function(e){""===e.target.value&&Object(a["s"])(this.network)},viewNetwork:function(e){return this.view.navigation="Network",this.view.detail="Network",this.view.entity=this.network,!1}},computed:{t:function(e){return r["f"]},l:function(e){return r["c"]+(this.index+1)*(r["d"]+r["g"])-1},w:function(e){return r["g"]},h:function(e){return r["e"]+this.model.components.length*(r["e"]+r["a"])}}},w=s,l=n("2877"),c=Object(l["a"])(w,i,o,!1,null,null,null);t["default"]=c.exports}}]);
//# sourceMappingURL=chunk-2d0b2b24.543249c4.js.map