#!/bin/bash

# api documentation: https://addons-server.readthedocs.io/en/latest/topics/api/auth.html#api-auth
# inspired by: https://willhaley.com/blog/generate-jwt-with-bash/

set -euo pipefail

# .env should contain:
# $MOZILLA_AMO_API_KEY
# $MOZILLA_AMO_SECRET
source .env
source 'scripts/lib/moz_amo_api.sh'
addon_id='photographicstart@robacarp'

# release="releases/photographic_start-firefox-$version.zip"

version=$(cat web_extension/VERSION)
upload_version "$addon_id" "$version" "releases/photographic_start-firefox-$version.zip"
