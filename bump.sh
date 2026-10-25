#!/bin/sh
# Bump the app version so installed (home-screen) copies pick up the new build.
v=$(date +%s)
sed -i "s|<meta name=\"app-version\" content=\"[0-9]*\">|<meta name=\"app-version\" content=\"$v\">|" index.html
printf '{"v":"%s"}\n' "$v" > version.json
echo "version $v"
