FROM ghcr.io/zerocluster/node

ENTRYPOINT [ "/bin/bash", "-l", "-c", "exec `node -e 'console.log(require(\"./package.json\").scripts.docker)'`" ]

RUN \
    # install deps
    npm i --omit=dev \
    \
    # cleanup
    && /bin/bash <(curl -fsSL https://raw.githubusercontent.com/softvisio/scripts/main/env-build-node.sh) cleanup
