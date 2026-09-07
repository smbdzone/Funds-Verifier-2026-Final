#!/usr/bin/env bash
set -e

echo "Starting Frontend Deployment"

cd /home/ubuntu/Funds-Verifier-2026-Final

echo "Getting latest code"
git fetch origin main
git checkout -B main origin/main
git reset --hard origin/main

echo "Installing dependencies"
npm install

# `next build` is run in its own session (setsid), not just nohup'd,
# and polled via a marker file rather than run as a foreground command
# directly on the connection. Confirmed (2026-09-07) that a foreground
# `npm run build` here gets killed partway through even with plenty of
# free memory/CPU and no OOM-killer or sshd timeout involved — and that
# plain nohup+disown isn't enough on its own: `next build` spawns its
# own worker child processes ("Collecting page data using N workers"),
# and a SIGHUP from the session's controlling terminal going away is
# sent to the whole process *group* — nohup only makes the top-level
# process immune to it, not those children. setsid detaches the entire
# tree into a brand-new session so no signal from this SSH session
# ending can reach any of it.
echo "Building Next.js application (detached)"
rm -f /tmp/fv-frontend-build.log /tmp/fv-frontend-build.done
setsid nohup bash -c 'npm run build > /tmp/fv-frontend-build.log 2>&1; echo $? > /tmp/fv-frontend-build.done' </dev/null >/dev/null 2>&1 &
disown

echo "Waiting for build to finish..."
for i in $(seq 1 120); do
  if [ -f /tmp/fv-frontend-build.done ]; then
    break
  fi
  sleep 5
done

if [ ! -f /tmp/fv-frontend-build.done ]; then
  echo "Build timed out after 10 minutes"
  tail -n 80 /tmp/fv-frontend-build.log
  exit 1
fi

BUILD_EXIT=$(cat /tmp/fv-frontend-build.done)
tail -n 40 /tmp/fv-frontend-build.log
if [ "$BUILD_EXIT" != "0" ]; then
  echo "Build failed with exit code $BUILD_EXIT"
  exit 1
fi
echo "Build succeeded"

echo "Restarting Frontend PM2"
pm2 restart fundsverifier-frontend

pm2 save

echo "Frontend Deployment Completed Successfully"
