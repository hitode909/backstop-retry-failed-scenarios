FROM backstopjs/backstopjs:5.0.8
RUN sudo npm install -g --allow-root --unsafe-perm backstop-retry-failed-scenarios@1.1.1
ENTRYPOINT []
