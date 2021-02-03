#!/bin/bash
rm -rf lib-jitsi-meet/
rm -rf ../lib-jitsi-meet/
git clone https://github.com/myntra/lib-jitsi-meet.git ../lib-jitsi-meet --branch knuth_changes --single-branch
git clone https://github.com/myntra/strophejs.git ../lib-jitsi-meet/strophejs-1.3.4 --branch knuth_changes --single-branch

