#!/bin/bash

# api documentation: https://addons-server.readthedocs.io/en/latest/topics/api/auth.html#api-auth
# inspired by: https://willhaley.com/blog/generate-jwt-with-bash/

set -euo pipefail

api_key=''
api_secret=''

api_base_uri='https://addons.mozilla.org/api/v5'

nonce=$RANDOM

source .env
api_key="$MOZILLA_AMO_API_KEY"
api_secret="$MOZILLA_AMO_SECRET"


# alg: signature algorithm
# typ: type: json web token
build_jwt_header() {
  echo '{ "alg": "HS256", "typ": "JWT" }'
}

# iss: issuer (api key)
# iat: issue at time (unix timestamp)
# exp: expire at time (unix timestamp) [mozilla: no longer than five minutes past the issued at time]
# jti: JWT ID. Some random-ish value.
build_jwt_body() {
  echo '{}' | \
  jq --exit-status \
    --arg nonce "$nonce" \
    --arg now "$(date +%s)" \
    --arg api_key "$api_key" \
    '
      .
      | .jti=($nonce | tonumber)
      | .iat=($now | tonumber)
      | .exp=($now | tonumber) + 60
      | .iss=($api_key)
    '
}

hmacsha256_sign() {
  declare input
  input=$(</dev/stdin)
  printf '%s' "$input" | openssl dgst -binary -sha256 -hmac "$api_secret"
}

base64_encode() {
  declare input
  input=$(</dev/stdin)
  # Use `tr` to URL encode the output from base64.
  printf '%s' "$input" \
    | base64 \
    | tr -d '=' \
    | tr '/+' '_-' \
    | tr -d '\n'
}

encode_jwt_request() {
  local payload
  payload=$(build_jwt_body)

  jwt_header=$(build_jwt_header | jq -c '.' | base64_encode)
  api_request=$(echo "${payload}" | jq -c '.' | base64_encode)
  encoded_request="$jwt_header.$api_request"

  signature=$(echo "${encoded_request}" | hmacsha256_sign | base64_encode)

  echo "${encoded_request}.${signature}"
}

# Pass the resource with a leading slash, and without the api version.
# Defaults to the example request from the mozilla documentation
api_request() {
  local resource
  resource=${1:-/accounts/profile}
  curl -g "${api_base_uri}${resource}" \
    -H "Authorization: JWT $(encode_jwt_request)"
}

upload_version() {
  local identifier
  identifier=${1:-}

  local version
  version=${2:-}

  local version_path
  version_path=${3:-something/something.xpi}

  curl "https://addons.mozilla.org/api/v5/addons/$identifier/versions/$version/" \
      -g -XPUT \
      -F "upload=@$version_path" \
      -H "Authorization: JWT $(encode_jwt_request)"
}

addon_versions() {
  local identifier
  identifier=${1:-}
  api_request "/addons/addon/$identifier/versions/"
}

addon_detail() {
  local identifier
  identifier=${1:-}
  api_request "/addons/addon/$identifier/"
}

search_addons() {
  local search
  search=${1:-}
  api_request "$api_base_uri/addons/search?q=$search"
}
