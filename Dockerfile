FROM backstopjs/backstopjs:5.4.4
RUN sudo npm install -g --allow-root --unsafe-perm backstop-retry-failed-scenarios@1.2.0
ENTRYPOINT []
