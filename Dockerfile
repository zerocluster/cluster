FROM zerocluster/node

# ENTRYPOINT [ "/bin/bash", "-l", "-c", "npm run environment", "bash" ]
# ENTRYPOINT [ "/bin/bash", "-l", "-c", "eval NODE_OPTIONS=\${NODE_OPTIONS_$NODE_ENV} && npm run environment -- \"$@\"", "bash" ]
ENTRYPOINT [ "/bin/bash", "-l", "-c", "eval NODE_OPTIONS=\"\${NODE_OPTIONS_$NODE_ENV}\" && npm run environment", "bash" ]

RUN \
    # install deps
    npm i --omit=dev \
    \
    # cleanup
    && curl -fsSL https://raw.githubusercontent.com/softvisio/scripts/main/env-build-node.sh | /bin/bash -s -- cleanup
