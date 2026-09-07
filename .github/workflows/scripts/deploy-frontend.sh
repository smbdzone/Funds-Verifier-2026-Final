#!/usr/bin/env bash
set -e

echo "Starting Frontend Deployment"

cd /home/ubuntu/Funds-Verifier-2026-Final

echo "Getting latest code"
git fetch origin fv-abbas
git reset --hard origin/fv-abbas

echo "Installing dependencies"
npm install

# `next build` is run detached from this SSH session and polled via a
# marker file, rather than run as a foreground command directly on the
# connection. Confirmed (2026-09-07) that a foreground `npm run build`
# here gets killed partway through even though the server itself has
# plenty of free memory/CPU and no OOM-killer or sshd timeout is
# involved — a plain polling loop over the same connection survives
# fine, so it's specifically the long-lived foreground build process
# that's at risk, not the session.
echo "Building Next.js application (detached)"
rm -f /tmp/fv-frontend-build.log /tmp/fv-frontend-build.done
nohup bash -c 'npm run build > /tmp/fv-frontend-build.log 2>&1; echo $? > /tmp/fv-frontend-build.done' >/dev/null 2>&1 &
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
