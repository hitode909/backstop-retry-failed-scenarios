FROM backstopjs/backstopjs:6.3.25
RUN sudo npm install -g --allow-root --unsafe-perm backstop-retry-failed-scenarios@1.3.0
ENTRYPOINT []
