var templates = {}

templates['Canonical'] = `---
schema:     {{schema}}
vnf:        {{vnf}}
version:    {{version}}
tenant:
  name:          "{{tenant.name}}"
  prefix:        "{{tenant.prefix}}"
  auth:
    username:    "{{tenant.auth.username}}"
    password:    "{{tenant.auth.password}}"
    proxy:       "{{tenant.auth.proxy}}"
    url:         "{{tenant.auth.url}}"
    cert:        "{{tenant.auth.cert}}"
    region:      "{{tenant.auth.region}}"
    vol_api:     "{{tenant.auth.vol_api}}"
    plugin:      "{{tenant.auth.plugin}}"
{% if tenant.service %}{% if tenant.service.network != "" %}
  service:
    network:     "{{tenant.service.network}}"
    cidr:        "{{tenant.service.cidr}}"
    gateway:     "{{tenant.service.gateway}}"
    proxy:       "{{tenant.service.proxy}}"
    port:        "{{tenant.service.port}}"
{% endif %}{% endif%}
  jumphost:      "{{tenant.jumphost}}"
  proxy:
    http:        "{{tenant.proxy.http}}"
    https:       "{{tenant.proxy.https}}"
flavors:
{% for flavor in flavors %}
  - uuid:    "{{flavor.uuid}}"
    name:    "{{flavor.name}}"
    vcpu:    {{flavor.vcpu}}
    ram:     {{flavor.ram}}
    disk:    {{flavor.disk}}
    public:  "{{flavor.public}}"
{% if flavor.special|length == 0 %}
    special: []
{% endif -%}
{% if flavor.special|length >  0 %}
    special:
{% endif -%}
{% for special in flavor.special %}
      - { key: "{{special.key}}", value: "{{special.value}}" }
{% endfor %}
{% endfor %}
images:
{% for image in images -%}
  - { uuid: "{{image.uuid}}", name: "{{image.name}}", version: "{{image.version}}", format: "{{image.format}}", container: "{{image.container}}", disk: "{{image.disk}}", size: "{{image.size}}", checksum: "{{image.checksum}}", url: "{{image.url}}", special: "{{image.special}}" }
{% endfor %}
networks:
{% for network in networks%}
  - uuid:      "{{network.uuid}}"
    name:      "{{network.name}}"
    external:  "{{network.external}}"
    ipv4:      "{{network.ipv4}}"
    ipv4gw:    "{{network.ipv4gw}}"
    ipv4start: "{{network.ipv4start}}"
    ipv4end:   "{{network.ipv4end}}"
    ipv6:      "{{network.ipv6}}"
    ipv6gw:    "{{network.ipv6gw}}"
    ipv6start: "{{network.ipv6start}}"
    ipv6end:   "{{network.ipv6end}}"
    route:     "{{network.route}}"
    export:    "{{network.export}}"
    import:    "{{network.import}}"
    special:   "{{network.special}}"
{% endfor %}
components:
{% for component in components %}
  - uuid:         "{{component.uuid}}"
    name:         "{{component.name}}"
    user:         "{{component.user}}"
    placement:    "{{component.placement}}"
    flavor:       "{{component.flavor}}"
    image:        "{{component.image}}"
    min:          {{component.min}}
    size:         {{component.size}}
    max:          {{component.max}}
{% if component.volumes|length == 0 %}
    volumes:      []
{% endif -%}
{% if component.volumes|length >  0 %}
    volumes:
{% endif -%}
{% for volume in component.volumes %}
      - { name: "{{volume.name}}", size: {{volume.size}}, type: "{{volume.type}}", attributes: "{{volume.attributes}}" }
{% endfor %}
{% if component.interfaces|length == 0 %}
    interfaces:   []
{% endif -%}
{% if component.interfaces|length >  0 %}
    interfaces:
{% endif -%}
{% for interface in component.interfaces %}
      - { network: "{{interface.network}}", attributes: "{{interface.attributes}}" }
{% endfor %}
{% if component.services|length == 0 %}
    services:     []
{% endif -%}
{% if component.services|length >  0 %}
    services:
{% endif -%}
{% for service in component.services %}
      - { name: "{{service.name}}", network: "{{service.network}}", protocol: "{{service.protocol}}", range: "{{service.range}}" }
{% endfor %}
{% if component.dependencies|length == 0 %}
    dependencies: []
{% endif -%}
{% if component.dependencies|length >  0 %}
    dependencies:
{% endif -%}
{% for dependency in component.dependencies %}
      - { component: "{{dependency.component}}", service: "{{dependency.service}}", network: "{{dependency.network}}" }
{% endfor %}
{% if component.userdata == "" %}
    userdata:     ""
{% endif -%}
{% if component.userdata != "" %}
    userdata: |
      {{ component.userdata | indent(6) | safe }}
{% endif -%}

{% endfor %}
`

//------------------------------------------------------------------------------

templates['Communication Matrix'] = `From                |Network |To                  |Service   |Protocol|Port (range)    |Network
{% for component1 in components %}{% for dependency in component1.dependencies %}
{% for component2 in components %}{% if component2.name == dependency.component %}
{% for service in component2.services %}{% if service.name == dependency.service %}
{{(component1.name    + '                    ') | truncate(20,false,'') }}|{{(dependency.network + '        ') | truncate(8,false,'') }}|{{(component2.name + '                    ') | truncate(20,false,'') }}|{{(service.name + '          ') | truncate(10,false,'') }}|{{(service.protocol + '        ') | truncate(8,false,'')  }}|{{(service.range      + '                ') | truncate(16,false,'') }}|{{(service.network    + '      ') | truncate(6,false,'')  }}
{% endif %}{% endfor %}
{% endif %}{% endfor %}
{% endfor %}{% endfor %}`

//------------------------------------------------------------------------------

templates['Environment'] = `---
# file: environment.yml

# ----- environment variables -----
env_vars:
  OS_TENANT_NAME:             "{{tenant.name}}"
  OS_PROJECT_NAME:            "{{tenant.name}}"
  OS_USERNAME:                "{{tenant.auth.username}}"
  OS_PASSWORD:                "{{tenant.auth.password}}"
  OS_API_PROXY:               "{{tenant.auth.proxy}}"
  OS_AUTH_URL:                "{{tenant.auth.url}}"
  OS_CACERT:                  "{{tenant.auth.cert}}"
  OS_REGION_NAME:             "{{tenant.auth.region}}"
  OS_VOLUME_API_VERSION:      "{{tenant.auth.vol_api}}"
  OS_AUTH_PLUGIN:             "{{tenant.auth.plugin}}"

  SERVICE_NETWORK:            "{{tenant.service.network}}"
  SERVICE_CIDR:               "{{tenant.service.cidr}}"
  SERVICE_GATEWAY:            "{{tenant.service.gateway}}"
  PROXY_ADDRESS:              "{{tenant.service.proxy}}"
  PROXY_PORT:                 "{{tenant.service.port}}"
  JUMPHOST:                   "{{tenant.jumphost}}"
{% if tenant.proxy.http %}{% if tenant.proxy.http != '' %}
  http_proxy:                 "{{tenant.proxy.http}}"
{% endif %}{% endif %}
{% if tenant.proxy.https %}{% if tenant.proxy.https != '' %}
  https_proxy:                "{{tenant.proxy.https}}"
{% endif %}{% endif %}`

//------------------------------------------------------------------------------

templates['Networks (create)'] = `#!/usr/bin/env ansible-playbook
---
- name: Create networks
  hosts: localhost
  connection: local
  gather_facts: false
  vars:
    ansible_python_interpreter: "{{ '{{ansible_playbook_python}}' }}"
  vars_files:
    - ../environment.yml
  environment: "{{ '{{env_vars}}' }}"
  tasks:
{% for network in networks %}{% if network.external != "true" %}
  - name: Create {{network.name}} network
    os_network:
      state:          present
      name:           {{tenant.prefix}}{{network.name}}
      validate_certs: no

  - name: Create {{network.name}} subnet
    os_subnet:
      state:                 present
      network_name:          {{tenant.prefix}}{{network.name}}
      name:                  {{tenant.prefix}}{{network.name}}_subnet
      cidr:                  {{network.ipv4}}
      allocation_pool_start: {{network.ipv4start}}
      allocation_pool_end:   {{network.ipv4end}}
      validate_certs:        no

{% endif %}{% endfor %}`

//------------------------------------------------------------------------------

templates['Networks (delete)'] = `#!/usr/bin/env ansible-playbook
---
- name: Delete networks
  hosts:        localhost
  connection:   local
  gather_facts: false
  vars:
    ansible_python_interpreter: "{{ '{{ansible_playbook_python}}' }}"
  vars_files:
    - ../environment.yml
  environment: "{{ '{{env_vars}}' }}"
  tasks:
    - name: Delete subnets
      os_subnet:
        state:          absent
        name:           "{{ '{{item}}' }}_subnet"
        validate_certs: no
      loop:
{% for network in networks %}{% if network.external != "true" %}
      - {{tenant.prefix}}{{network.name}}
{% endif %}{% endfor %}

    - name: Delete networks
      os_network:
        state:          absent
        name:           "{{ '{{item}}' }}"
        validate_certs: no
      loop:
{% for network in networks %}{% if network.external != "true" %}
      - {{tenant.prefix}}{{network.name}}
{% endif %}{% endfor %}`

//------------------------------------------------------------------------------

templates['Networks (status)'] = `#!/usr/bin/env ansible-playbook
---
- name: Create network inventory of the tenant
  hosts:        localhost
  connection:   local
  gather_facts: false
  vars:
    ansible_python_interpreter: "{{ '{{ansible_playbook_python}}' }}"
  vars_files:
    - ../environment.yml
  environment: "{{ '{{env_vars}}' }}"
  tasks:
    - name: Define networks
      set_fact:
        network_names:
{% for network in networks %}
          - {{tenant.prefix}}{{network.name}}
{% endfor %}

    - name: Collect network information
      os_networks_facts:
         validate_certs: no
      register: networks
      ignore_errors: yes

    - name: Collect subnet information
      os_subnets_facts:
         validate_certs: no
      register: subnets
      ignore_errors: yes

    - name: Create output directory
      file:
        path:  ../output
        state: directory
      delegate_to:  localhost

    - name: Create report 'networks.yml'
      template:
        src:  ../templates/networks.tmpl
        dest: ../output/networks.yml
      delegate_to:  localhost
      changed_when: false`

//------------------------------------------------------------------------------

templates['Servers (status)'] = `#!/usr/bin/env ansible-playbook
---
- name: Create server inventory of the tenant
  hosts:        localhost
  connection:   local
  gather_facts: false
  vars:
    ansible_python_interpreter: "{{ '{{ansible_playbook_python}}' }}"
  vars_files:
    - ../environment.yml
  environment: "{{ '{{env_vars}}' }}"
  tasks:
    - name: Define prefix
      set_fact:
        prefix: "{{tenant.prefix}}"

    - name: Define jumphost
      set_fact:
        jumphost: {{tenant.jumphost}}

    - name: Define servers
      set_fact:
        server_names:
{% for component in components %}{% if component.placement != 'OTHER' %}{% if component.placement != 'ROUTER' %}
{% if component.max == 1 %}
          - {{tenant.prefix}}{{component.name}}
{% else %}
{% for server_index in range(1,1+component.max,1) %}
          - {{tenant.prefix}}{{component.name}}-{{server_index}}
{% endfor %}
{% endif %}
{% endif %}{% endif %}{% endfor %}

    - name: Define ssh servers
      set_fact:
        ssh_server_names:
{% for component in components %}{% if component.placement != 'OTHER' %}{% if component.placement != 'ROUTER' %}{% if component.user != '' %}
{% if component.max == 1 %}
          - {{tenant.prefix}}{{component.name}}
{% else %}
{% for server_index in range(1,1+component.max,1) %}
          - {{tenant.prefix}}{{component.name}}-{{server_index}}
{% endfor %}
{% endif %}
{% endif %}{% endif %}{% endif %}{% endfor %}


    - name: Define ports
      set_fact:
        port_names:
{% for component in components %}{% if component.placement != 'OTHER' %}{% if component.placement != 'ROUTER' %}
{% for interface in component.interfaces %}
{% if component.max == 1 %}
          - {{tenant.prefix}}{{component.name}}_{{tenant.prefix}}{{interface.network}}
{% else %}
{% for server_index in range(1,component.max,1) %}
          - {{tenant.prefix}}{{component.name}}-{{server_index}}_{{tenant.prefix}}{{interface.network}}
{% endfor %}
{% endif %}
{% endfor %}
{% endif %}{% endif %}{% endfor %}

    - name: Collect server information
      os_server_facts:
         validate_certs: no
      register: servers
      ignore_errors: yes

    - name: Collect port information
      os_port_facts:
         validate_certs: no
      register: ports
      ignore_errors: yes

    - name: Create output directory
      file:
        path:  ../output
        state: directory
      delegate_to:  localhost

    - name: Create report 'servers.yml'
      template:
        src:  ../templates/servers.tmpl
        dest: ../output/servers.yml
      delegate_to:  localhost
      changed_when: false

    - name: Create ansible ssh config
      template:
        src:  ../templates/config
        dest: ../output/config
      delegate_to:  localhost
      changed_when: false

    - name: Create ansible inventory
      template:
        src:  ../templates/inventory
        dest: ../output/inventory
      delegate_to:  localhost
      changed_when: false`

//------------------------------------------------------------------------------

templates['Servers (define security)'] = `{% for component in components %}{% if component.placement != 'OTHER' %}{% if component.placement != 'ROUTER' %}
----- {{tenant.prefix}}{{component.name}} -----
#!/usr/bin/env ansible-playbook
---
- name: Create security groups for ports of server {{component.name}}
  hosts: localhost
  connection: local
  gather_facts: false
  vars:
    ansible_python_interpreter: "{{ '{{ansible_playbook_python}}' }}"
  vars_files:
    - ../../environment.yml
  environment: "{{ '{{env_vars}}' }}"
  tasks:

{% for interface in component.interfaces %}
  # ----- security group for {{tenant.prefix}}{{component.name}} interface {{tenant.prefix}}{{interface.network}} -----
  - name: Create {{tenant.prefix}}{{component.name}}_{{tenant.prefix}}{{interface.network}} security group
    os_security_group:
      state:          present
      name:           {{tenant.prefix}}{{component.name}}_{{tenant.prefix}}{{interface.network}}
      description:    Security group for the {{tenant.prefix}}{{component.name}} {{tenant.prefix}}{{interface.network}} interface.
      validate_certs: no
    register: secgroup

  # ----- reset all ingress security rules for {{tenant.prefix}}{{component.name}} interface {{tenant.prefix}}{{interface.network}} -----
  - name: Delete all ingress {{tenant.prefix}}{{component.name}}_{{tenant.prefix}}{{interface.network}} security group rules
    os_security_group_rule:
      state:            absent
      security_group:   {{tenant.prefix}}{{component.name}}_{{tenant.prefix}}{{interface.network}}
      protocol:         "{{ '{{item.protocol}}' }}"
      port_range_min:   "{{ '{{item.port_range_min}}' }}"
      port_range_max:   "{{ '{{item.port_range_max}}' }}"
      remote_ip_prefix: "{{ '{{item.remote_ip_prefix}}' }}"
      direction:        ingress
      validate_certs:   no
    ignore_errors:      yes
    loop: "{{ '{{secgroup.secgroup.security_group_rules}}' }}"
    when: item.direction == "ingress"

  # ----- security group rules for {{tenant.prefix}}{{component.name}} interface {{tenant.prefix}}{{interface.network}} -----
  - name: Create {{tenant.prefix}}{{component.name}}_{{tenant.prefix}}{{interface.network}} security group rules
    os_security_group_rule:
      state:            present
      security_group:   {{tenant.prefix}}{{component.name}}_{{tenant.prefix}}{{interface.network}}
      protocol:         "{{ '{{item.protocol}}' }}"
      port_range_min:   "{{ '{{item.port_range_min}}' }}"
      port_range_max:   "{{ '{{item.port_range_max}}' }}"
      remote_ip_prefix: "{{ '{{item.remote_ip_prefix}}' }}"
      direction:        ingress
      validate_certs:   no
    ignore_errors:      yes
    loop:
    - {protocol: icmp, port_range_min: 0, port_range_max: 255, remote_ip_prefix: 0.0.0.0/0}
{% for service in component.services %}{% if interface.network == service.network %}
{% for network in networks %}{% if interface.network == network.name %}
    - {protocol: {{service.protocol}}, port_range_min: {{service.range | portmin }}, port_range_max: {{service.range | portmax }}, remote_ip_prefix: {{network.ipv4}} }
{% endif %}{% endfor %}
{% endif %}{% endfor %}
{% for service in component.services %}{% if interface.network == service.network %}
{% for component2 in components %}{% if component2.placement != 'ROUTER' %}
{% for dependency in component2.dependencies %}{% if dependency.component == component.name %}{% if dependency.service == service.name %}
{% for network2 in networks %}{% if dependency.network == network2.name %}
    - {protocol: {{service.protocol}}, port_range_min: {{service.range | portmin }}, port_range_max: {{service.range | portmax }}, remote_ip_prefix: {{network2.ipv4}} }
{% endif %}{% endfor %}
{% endif %}{% endif %}{% endfor %}
{% endif %}{% endfor %}
{% endif %}{% endfor %}

{% endfor %}
{% endif %}{% endif %}{% endfor %}`

//------------------------------------------------------------------------------

templates['Servers (undefine security)'] = `{% for component in components %}{% if component.placement != 'OTHER' %}{% if component.placement != 'ROUTER' %}
----- {{tenant.prefix}}{{component.name}} -----
#!/usr/bin/env ansible-playbook
---
- name: Delete security groups for ports of server {{tenant.prefix}}{{component.name}}
  hosts: localhost
  connection: local
  gather_facts: false
  vars:
    ansible_python_interpreter: "{{ '{{ansible_playbook_python}}' }}"
  vars_files:
    - ../../environment.yml
  environment: "{{ '{{env_vars}}' }}"
  tasks:

{% for interface in component.interfaces %}
  # ----- security group for {{component.name}} interface {{tenant.prefix}}{{interface.network}} -----
  - name: Delete {{tenant.prefix}}{{component.name}}_{{tenant.prefix}}{{interface.network}} security group
    os_security_group:
      state:          absent
      name:           {{tenant.prefix}}{{component.name}}_{{tenant.prefix}}{{interface.network}}
      description:    Security group for the {{tenant.prefix}}{{component.name}} {{tenant.prefix}}{{interface.network}} interface.
      validate_certs: no

{% endfor %}
{% endif %}{% endif %}{% endfor %}`

//------------------------------------------------------------------------------

templates['Servers (define security all)'] = `#!/usr/bin/env ansible-playbook
---
{% for component in components %}{% if component.placement != 'OTHER' %}{% if component.placement != 'ROUTER' %}
- name: Create {{tenant.prefix}}{{component.name}}
  import_playbook: {{tenant.prefix}}{{component.name}}/define_security.yml
{% endif %}{% endif %}{% endfor %}`

//------------------------------------------------------------------------------

templates['Servers (define security all2)'] = `#!/usr/bin/env bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
{% for component in components %}{% if component.placement != 'OTHER' %}{% if component.placement != 'ROUTER' %}
$SCRIPTPATH/{{tenant.prefix}}{{component.name}}/define_security.yml &
{% endif %}{% endif %}{% endfor %}
wait`

//------------------------------------------------------------------------------

templates['Servers (undefine security all)'] = `#!/usr/bin/env ansible-playbook
---
{% for component in components %}{% if component.placement != 'OTHER' %}{% if component.placement != 'ROUTER' %}
- name: Create {{tenant.prefix}}{{component.name}}
  import_playbook: {{tenant.prefix}}{{component.name}}/undefine_security.yml
{% endif %}{% endif %}{% endfor %}`

//------------------------------------------------------------------------------

templates['Servers (undefine security all2)'] = `#!/usr/bin/env bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
{% for component in components %}{% if component.placement != 'OTHER' %}{% if component.placement != 'ROUTER' %}
$SCRIPTPATH/{{tenant.prefix}}{{component.name}}/undefine_security.yml &
{% endif %}{% endif %}{% endfor %}
wait`

//------------------------------------------------------------------------------

templates['Servers (create all)'] = `#!/usr/bin/env ansible-playbook
---
{% for component in components %}{% if component.placement != 'OTHER' %}{% if component.placement != 'ROUTER' %}
{% if component.max == 1 %}
- name: Unset nr
  hosts:        localhost
  connection:   local
  gather_facts: false
  tasks:
  - name: Set nr = ""
    set_fact:
      nr: ""
- name: Create {{tenant.prefix}}{{component.name}}
  import_playbook: {{tenant.prefix}}{{component.name}}/create.yml
{% else %}
{% for index in range(component.max) %}
- name: Set nr {{index+1}}
  hosts:        localhost
  connection:   local
  gather_facts: false
  tasks:
  - name: Set nr = {{index+1}}
    set_fact:
      nr: {{index+1}}
- name: Create {{tenant.prefix}}{{component.name}} {{index+1}}
  import_playbook: {{tenant.prefix}}{{component.name}}/create.yml
{% endfor %}
{% endif %}
{% endif %}{% endif %}{% endfor %}`

//------------------------------------------------------------------------------

templates['Servers (create all2)'] = `#!/usr/bin/env bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
{% for component in components %}{% if component.placement != 'OTHER' %}{% if component.placement != 'ROUTER' %}
{% if component.max == 1 %}
$SCRIPTPATH/{{tenant.prefix}}{{component.name}}/create.yml &
{% else %}
{% for index in range(component.max) %}
$SCRIPTPATH/{{tenant.prefix}}{{component.name}}/create.yml --extra-vars "nr={{index+1}}" &
{% endfor %}
{% endif %}
{% endif %}{% endif %}{% endfor %}
wait`

//------------------------------------------------------------------------------

templates['Servers (delete all)'] = `#!/usr/bin/env ansible-playbook
---
{% for component in components %}{% if component.placement != 'OTHER' %}{% if component.placement != 'ROUTER' %}
{% if component.max == 1 %}
- name: Unset nr
  hosts:        localhost
  connection:   local
  gather_facts: false
  tasks:
  - name: Set nr = ""
    set_fact:
      nr: ""
  - name: Delete {{tenant.prefix}}{{component.name}}
    import_tasks: {{tenant.prefix}}{{component.name}}/delete.yml
{% else %}
{% for index in range(component.max) %}
- name: Set nr {{index+1}}
  hosts:        localhost
  connection:   local
  gather_facts: false
  tasks:
  - name: Set nr = {{index+1}}
    set_fact:
      nr: {{index+1}}
  - name: Delete {{tenant.prefix}}{{component.name}} {{index+1}}
    import_playbook: {{component.name}}/delete.yml
{% endfor %}
{% endif %}
{% endif %}{% endif %}{% endfor %}`

//------------------------------------------------------------------------------

templates['Servers (delete all2)'] = `#!/usr/bin/env bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
{% for component in components %}{% if component.placement != 'OTHER' %}{% if component.placement != 'ROUTER' %}
{% if component.max == 1 %}
$SCRIPTPATH/{{tenant.prefix}}{{component.name}}/delete.yml &
{% else %}
{% for index in range(component.max) %}
$SCRIPTPATH/{{tenant.prefix}}{{component.name}}/delete.yml --extra-vars "nr={{index+1}}" &
{% endfor %}
{% endif %}
{% endif %}{% endif %}{% endfor %}
wait`

//------------------------------------------------------------------------------

templates['Servers (create)'] = `{% for component in components %}{% if component.placement != 'OTHER' %}{% if component.placement != 'ROUTER' %}
----- {{tenant.prefix}}{{component.name}} -----
#!/usr/bin/env ansible-playbook
---
- name: Create server {{tenant.prefix}}{{component.name}}
  hosts: localhost
  connection: local
  gather_facts: false
  vars:
    ansible_python_interpreter: "{{ '{{ansible_playbook_python}}' }}"
  vars_files:
    - ../../environment.yml
  environment: "{{ '{{env_vars}}' }}"
  tasks:
  - name: Set index I/II
    set_fact:
      idx: "{{ '{{' }} nr | default ('') {{ '}}' }}"

  - name: Set index II/II
    set_fact:
      index: "{{ '{{' }} (idx == '') | ternary( '', '-' + idx) {{ '}}' }}"

{% for interface in component.interfaces %}
  # ----- {{interface.network}} port for {{tenant.prefix}}{{component.name}} -----
  - name: Create {{interface.network}} port for {{tenant.prefix}}{{component.name}}
    os_port:
      state:          present
      name:           "{{tenant.prefix}}{{component.name}}{{ '{{ index }}' }}_{{tenant.prefix}}{{interface.network}}"
      network:        "{{tenant.prefix}}{{interface.network}}"
      validate_certs: no
      security_groups:
      - "{{tenant.prefix}}{{component.name}}_{{tenant.prefix}}{{interface.network}}"
{% if interface.attributes|allowed|length > 0 %}
      allowed_address_pairs:
{% for allowed in interface.attributes|allowed %}
      - ip_address: {{allowed}}
{% endfor %}{% endif %}
{% if interface.attributes|fixed|length > 0 %}
      fixed_ips:
{% for fixed in interface.attributes|fixed %}
      - ip_address: {{fixed}}
{% endfor %}{% endif %}

{% endfor %}

  # ----- {{component.name}} virtual machine -----
  - name: Create virtual machine for {{component.name}} server
    os_server:
      state:          present
      name:           {{tenant.prefix}}{{component.name}}{{ '{{ index }}' }}
      flavor:         "{{component.flavor}}"
      image:          "{{component.image}}"
      key_name:       fiveg_key
      config_drive:   yes
      auto_ip:        no
      timeout:        600
      validate_certs: no
      nics:
{% for interface in component.interfaces %}
        - port-name: {{tenant.prefix}}{{component.name}}{{ '{{ index }}' }}_{{tenant.prefix}}{{interface.network}}
{% endfor %}
      meta:
       hostname: {{tenant.prefix}}{{component.name}}{{ '{{ index }}' }}
{% if component.userdata != "" %}
      userdata: |
        {{ component.userdata | indent(8) | safe }}
{% endif %}

{% if component.name == "jumphost" %}{% if tenant.jumphost != "" %}
  # ----- floating IP for jumphost -----
  - name: Determine {{tenant.prefix}}jumphost_{{tenant.prefix}}oam port information
    os_port_facts:
      port:           "{{tenant.prefix}}jumphost_{{tenant.prefix}}oam"
      validate_certs: no
    register: jumphost_oam_facts

  - name: Assign floating IP to jumphost
    os_floating_ip:
      state:               present
      server:              {{tenant.prefix}}jumphost
      floating_ip_address: "{{tenant.jumphost}}"
      fixed_address:       "{{ '{{' }} jumphost_oam_facts.ansible_facts.openstack_ports[0].fixed_ips[0].ip_address {{ '}}' }}"
      validate_certs:      no

{% endif %}{% endif %}

{% for volume in component.volumes %}
  # ----- {{volume.name}} volume for {{tenant.prefix}}{{component.name}} -----
  - name: Create {{volume.name}} volume for {{tenant.prefix}}{{component.name}}
    os_volume:
      state:          present
      name:           "{{tenant.prefix}}{{component.name}}{{ '{{ index }}' }}_{{volume.name}}"
      size:           {{volume.size}}
      display_name:   "{{volume.name}} volume for {{tenant.prefix}}{{component.name}}"
      validate_certs: no

  - name: Attach volume {{volume.name}} to {{tenant.prefix}}{{component.name}}
    os_server_volume:
      state:          present
      server:         "{{tenant.prefix}}{{component.name}}{{ '{{ index }}' }}"
      volume:         "{{tenant.prefix}}{{component.name}}{{ '{{ index }}' }}_{{volume.name}}"
      validate_certs: no

{% endfor %}

{% endif %}{% endif %}{% endfor %}`

//------------------------------------------------------------------------------

templates['Servers (delete)'] = `{% for component in components %}{% if component.placement != 'OTHER' %}{% if component.placement != 'ROUTER' %}
----- {{tenant.prefix}}{{component.name}} -----
#!/usr/bin/env ansible-playbook
---
- name: Delete server {{component.name}}
  hosts: localhost
  connection: local
  gather_facts: false
  vars:
    ansible_python_interpreter: "{{ '{{ansible_playbook_python}}' }}"
  vars_files:
    - ../../environment.yml
  environment: "{{ '{{env_vars}}' }}"
  tasks:
  - name: Set index I/II
    set_fact:
      idx: "{{ '{{' }} nr | default ('') {{ '}}' }}"

  - name: Set index II/II
    set_fact:
      index: "{{ '{{' }} (idx == '') | ternary( '', '-' + idx) {{ '}}' }}"

{% for interface in component.interfaces %}
  # ----- {{tenant.prefix}}{{interface.network}} port for {{tenant.prefix}}{{component.name}} -----
  - name: Delete {{tenant.prefix}}{{interface.network}} port for {{tenant.prefix}}{{component.name}}
    os_port:
      state:          absent
      name:           "{{tenant.prefix}}{{component.name}}{{ '{{ index }}' }}_{{tenant.prefix}}{{interface.network}}"
      network:        "{{tenant.prefix}}{{interface.network}}"
      validate_certs: no

{% endfor %}

  # ----- {{tenant.prefix}}{{component.name}} virtual machine -----
  - name: Delete virtual machine for {{tenant.prefix}}{{component.name}} server
    os_server:
      state:          absent
      name:           {{tenant.prefix}}{{component.name}}{{ '{{ index }}' }}
      validate_certs: no

{% for volume in component.volumes %}
  # ----- {{volume.name}} volume for {{tenant.prefix}}{{component.name}} -----
  - name: Delete {{volume.name}} volume for {{tenant.prefix}}{{component.name}}
    os_volume:
      state:          absent
      name:           "{{tenant.prefix}}{{component.name}}{{ '{{ index }}' }}_{{volume.name}}"
      validate_certs: no

{% endfor %}

{% endif %}{% endif %}{% endfor %}`

//------------------------------------------------------------------------------

templates['Servers (ssh all)'] = `#!/usr/bin/env ansible-playbook
---
{% for component in components %}{% if component.placement != 'OTHER' %}{% if component.placement != 'ROUTER' %}{% if component.user != '' %}
{% if component.max == 1 %}
- name: Unset nr
  hosts:        localhost
  connection:   local
  gather_facts: false
  tasks:
  - name: Set nr = ""
    set_fact:
      nr: ""
- name: SSH for {{tenant.prefix}}{{component.name}}
  import_playbook: {{tenant.prefix}}{{component.name}}/ssh.yml
{% else %}
{% for index in range(component.max) %}
- name: Set nr {{index+1}}
  hosts:        localhost
  connection:   local
  gather_facts: false
  tasks:
  - name: Set nr = {{index+1}}
    set_fact:
      nr: {{index+1}}
- name: SSH for {{tenant.prefix}}{{component.name}} {{index+1}}
  import_playbook: {{tenant.prefix}}{{component.name}}/ssh.yml
{% endfor %}
{% endif %}
{% endif %}{% endif %}{% endif %}{% endfor %}`

//------------------------------------------------------------------------------

templates['Servers (ssh all2)'] = `#!/usr/bin/env bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
{% for component in components %}{% if component.placement != 'OTHER' %}{% if component.placement != 'ROUTER' %}{% if component.user != '' %}
{% if component.max == 1 %}
$SCRIPTPATH/{{tenant.prefix}}{{component.name}}/ssh.yml &
{% else %}
{% for index in range(component.max) %}
$SCRIPTPATH/{{tenant.prefix}}{{component.name}}/ssh.yml --extra-vars "nr={{index+1}}" &
{% endfor %}
{% endif %}
{% endif %}{% endif %}{% endif %}{% endfor %}
wait`

//------------------------------------------------------------------------------

templates['Servers (ssh)'] = `{% for component in components %}{% if component.placement != 'OTHER' %}{% if component.placement != 'ROUTER' %}{% if component.user != '' %}
----- {{tenant.prefix}}{{component.name}} -----
#!/usr/bin/env ansible-playbook
---
- name: Determine index of server
  hosts: localhost
  gather_facts: false
  tasks:
    - name: Set index I/II
      set_fact:
        host: "{{tenant.prefix}}{{component.name + '-' + '{{ nr }}' }}"
      when: nr is defined

    - name: Set index II/II
      set_fact:
        host: "{{tenant.prefix}}{{component.name}}"
      when: nr is not defined

- name: Update ssh keys for server '{{tenant.prefix}}{{component.name}}'
  hosts: "{{ "{{ hostvars['localhost']['host'] }}" | safe }}"
  gather_facts: false
  tasks:
    - name: Update authorized keys file for server '{{tenant.prefix}}{{component.name}}'
      authorized_key:
        user: '{{ component.user }}'
        key: "{{ '{{ item }}' }}"
        state: present
        exclusive: True
      become: yes
      with_file:
        - ../../../repository/authorized_keys
{% endif %}{% endif %}{% endif %}{% endfor %}`

//------------------------------------------------------------------------------

templates['Router (create)'] = `{% for component in components %}{% if component.placement == 'ROUTER' %}
----- {{tenant.prefix}}{{component.name}} -----
#!/usr/bin/env ansible-playbook
---
- name: Create router {{component.name}}
  hosts: localhost
  connection: local
  gather_facts: false
  vars:
    ansible_python_interpreter: "{{ '{{ansible_playbook_python}}' }}"
  vars_files:
    - ../../environment.yml
  environment: "{{ '{{env_vars}}' }}"
  tasks:

  # ----- {{tenant.prefix}}{{component.name}} router -----
  - name: Create router {{tenant.prefix}}{{component.name}}
    os_router:
      state:          present
      name:           {{tenant.prefix}}{{component.name}}
      validate_certs: no
      interface:
{% for interface in component.interfaces %}
      - subnet: {{tenant.prefix}}{{interface.network}}_subnet
{% endfor %}


{% endif %}{% endfor %}`

//------------------------------------------------------------------------------

templates['Router (delete)'] = `{% for component in components %}{% if component.placement == 'ROUTER' %}
----- {{tenant.prefix}}{{component.name}} -----
#!/usr/bin/env ansible-playbook
---
- name: Create router {{component.name}}
  hosts: localhost
  connection: local
  gather_facts: false
  vars:
    ansible_python_interpreter: "{{ '{{ansible_playbook_python}}' }}"
  vars_files:
    - ../../environment.yml
  environment: "{{ '{{env_vars}}' }}"
  tasks:

  # ----- {{tenant.prefix}}{{component.name}} router -----
  - name: Delete router {{tenant.prefix}}{{component.name}}
    os_router:
      state:          absent
      name:           {{tenant.prefix}}{{component.name}}
      validate_certs: no
      interface:
{% for interface in component.interfaces %}
      - subnet: {{tenant.prefix}}{{interface.network}}_subnet
{% endfor %}


{% endif %}{% endfor %}`

//------------------------------------------------------------------------------

templates['openrc'] = `
export OS_TENANT_NAME={{tenant.name}}
export OS_PROJECT_NAME={{tenant.name}}
export OS_USERNAME={{tenant.auth.username}}
export OS_PASSWORD={{tenant.auth.password}}
export OS_AUTH_URL={{tenant.auth.url}}
export OS_CACERT=../repository/openstack.crt`

//------------------------------------------------------------------------------

templates['ssh'] = `#!/usr/bin/env ansible-playbook
---
{% for component in components %}{% if component.placement != 'OTHER' %}{% if component.placement != 'ROUTER' %}{% if component.user != '' %}
{% if component.max == 1 %}
- name: Update ssh keys for server {{tenant.prefix}}{{component.name}}
  hosts: '{{tenant.prefix}}{{component.name}}'
  gather_facts: false
  tasks:
    - name: Update authorized keys file for server {{tenant.prefix}}{{component.name}}
      authorized_key:
        user: '{{ component.user }}'
        key: "{{ '{{ item }}' }}"
        state: present
        exclusive: True
      become: yes
      with_file:
        - ../../repository/authorized_keys

{% else %}
{% for server_index in range(1,1+component.max,1) %}
- name: Update ssh keys for server {{tenant.prefix}}{{component.name}}-{{server_index}}
  hosts: '{{tenant.prefix}}{{component.name}}-{{server_index}}'
  gather_facts: false
  tasks:
    - name: Update authorized keys file for server {{tenant.prefix}}{{component.name}}-{{server_index}}
      authorized_key:
        user: '{{ component.user }}'
        key: "{{ '{{ item }}' }}"
        state: present
        exclusive: True
      become: yes
      with_file:
        - ../../repository/authorized_keys

{% endfor %}
{% endif %}
{% endif %}{% endif %}{% endif %}{% endfor %}`

//------------------------------------------------------------------------------

templates['Prequisites'] = `
{% set instances, volumes, vcpu, ram, disk = 0 %}
{% for component in components %}{% if component.placement != 'OTHER' %}{% if component.placement != 'ROUTER' %}
{% set instances = instances + 1 %}
{% for flavor in flavors %}{% if component.flavor == flavor.name %}
{% set vcpu = vcpu + flavor.vcpu %}
{% set ram  = ram  + flavor.ram * 1024 %}
{% set disk = disk + flavor.disk %}
{% endif %}{% endfor %}
{% for volume in component.volumes %}
{% set volumes = volumes + 1 %}
{% set disk    = disk  + volume.size * 1024 %}
{% endfor %}
{% endif %}{% endif %}{% endfor %}
Prequisites:
============

Tenant: {{tenant.name}}

Name of ssh-key: fiveg_key

Quota:
------

* Virtual machines:     {{instances}}
* Volumes:              {{volumes}}
* Virtual CPUs:         {{vcpu}}
* Random Access Memory: {{ram}} [MB]
* Disk Storage:         {{disk}} [MB]

Flavors:
--------
{% for flavor in flavors %}
{% set found = false %}
{% for component in components %}{% if component.placement != 'OTHER' %}{% if component.placement != 'ROUTER' %}
{% if found == false %}{% if component.flavor == flavor.name %}
* {{(flavor.name + "                    ") | truncate(20, true, "") }}: {{flavor.vcpu}} vCPUs / {{flavor.ram}} [MB ram] / {{flavor.disk}} [GB disk]
{% set found = true %}
{% endif %}{% endif %}
{% endif %}{% endif %}{% endfor %}
{% endfor %}

Images:
-------
{% for image, components in components | groupby("image") %}
* {{(image + "                               ") | truncate(32, true, "") }}: {% for component in components %}{% if component.placement != 'OTHER' %}{% if component.placement != 'ROUTER' %} {{ component.name }}{% endif %}{% endif %}{% endfor %}\n
{% endfor %}
`

//------------------------------------------------------------------------------

templates['readme'] = `
README
======

VNF:     {{vnf}}
Version: {{version}}
Tenant:  {{tenant.name}}
Prefix:  {{tenant.prefix}}

Prequisites
-----------
- access to OpenStack API
- ansible installed
- openstack client installed
- repository directory (next to the directory containing this readme):
  - id_rsa (private key for accessing the virtual machines)
  - openstack.crt (certificate file of OpenStack API)
  - authorized_keys (file with all public keys to be uploaded to VMs)

Preparation
-----------
- source ./setup.sh

Usage
-----

create, delete and determine status of networks:
- ./networks/create.yml
- ./networks/delete.yml
- ./networks/status.yml

create, delete security policies:
- ./servers/define_security.sh
- ./servers/undefine_security.sh

create, delete and determine status of servers:
- ./servers/create.sh
- ./servers/delete.sh
- ./servers/status.yml

distribute ssh keys to servers:
- ./servers/ssh.sh
`

//------------------------------------------------------------------------------

templates['config'] = `
Host jumphost
  User         ubuntu
  HostName     {{tenant.jumphost}}

{% for component in components %}{% if component.placement != 'OTHER' %}{% if component.placement != 'ROUTER' %}
{{ "{%" }} for port in ports.ansible_facts.openstack_ports {{ "%}{%" }} if port.name == '{{tenant.prefix}}{{component.name}}_{{tenant.prefix}}oam' {{ "%}" }}
Host {{component.name}}
  User         {{component.user}}
  ProxyCommand ssh -i ../repository/id_rsa ubuntu@{{tenant.jumphost}} -W %h:%p
  HostName     {{ "{{" }} port.fixed_ips | map(attribute='ip_address') | join(', ') {{ "}}" }}

{{ "{% endif %}{% endfor %}" }}
{% endif %}{% endif %}{% endfor %}

Host *
  StrictHostKeyChecking no
  UserKnownHostsFile=/dev/null
  IdentityFile ../repository/id_rsa`

//------------------------------------------------------------------------------
