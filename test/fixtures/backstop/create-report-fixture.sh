#!/bin/bash

# npm install -g backstopjs
# backstop reference;
backstop test;
rm -rf backstop_data/bitmaps*
mv backstop_data/html_report/config.js backstop_data/html_report_config.js
rm -rf backstop_data/html_report/*
mv backstop_data/html_report_config.js backstop_data/html_report/config.js