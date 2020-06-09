FROM backstopjs/backstopjs:5.0.1
RUN sudo npm install -g --allow-root --unsafe-perm backstop-retry-failed-scenarios@1.0.2
ENTRYPOINT []
