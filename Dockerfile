FROM backstopjs/backstopjs
RUN sudo npm install -g --allow-root --unsafe-perm backstop-retry-failed-scenarios@1.0.0
ENTRYPOINT []
