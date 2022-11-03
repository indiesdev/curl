# cURL for GitHub Action

You can use this action to perform REST API requests, using the [axios](https://github.com/axios/axios) module.

# Usage

```yaml
name: Example of cURL action

on: [push]
jobs:
  test-curl-action:
    name: "Perform REST API request"
    runs-on: ubuntu-latest
    steps:
      - name: "Call API"
        uses: indiesdev/curl@v1.1
        with:
          # The target URL
          # Required: true if custom-config is not set
          url: https://reqres.in/api/users

          # The request method, basically it's one of GET|POST|PUT|PATCH
          # Default is GET
          method: "POST"

          # List of response status codes to be accepted, else it will set the job to be failed
          # If more than one value is needed, you can use comma (,) as separator
          # In this case if the response status code is not one of 200, 201 and 204, the job will be failed
          # Default is 200,201,204
          accept: 200,201,204

          # Headers can be passed through with a json object string
          headers: '{ "custom-header": "value" }'

          # Params can be passed through with a json object string
          params: '{ "param1": "value", "param2": "value2" }'

          # Body request
          # Apply only to POST|PUT request
          body: '{ "name": "breeze",  "job": "devops" }'

          # Request timeout (millisec)
          # Default: 1000
          timeout: 1000

          # Basic authentication using username and password
          # This will override the Authorization header, for example Authorization: Basic QWxhZGRpbjpPcGVuU2VzYW1l
          # Format => username:password as base 64
          basic-auth-token: ${{ secrets.curl_auth_token }}

          # The authentication using token
          # This will override the Authorization header, for example Authorization: Bearer QWxhZGRpbjpPcGVuU2VzYW1l
          bearer-token: ${{ secrets.bearer_token }}

          # If you want to use proxy with the request, you can use proxy-url
          # Format => host:port
          proxy-url: https://proxy-url:3000

          # If the proxy host requires authentication, you can use proxy-auth to pass credentials
          # Format => username:password as base64
          proxy-auth-token: ${{ secrets.proxy_auth_token }}

          # If it is set to true, it will show the response log in the GitHub UI
          # Default: false
          log-response: false

          # The number of attempts before giving up
          # Default: 1
          retries: 3

          # If you want to use axios config directly, you can pass a config file to the action
          # The file is just basically a json file that has the same format as axios config https://github.com/axios/axios#request-config
          # If this input is set, it will ignore other inputs related to the config
          # The path file is relative to the root directory of the repo
          custom-config: .github/workflows/curl-config.json
```

# Response object

```javascript
{
  // `data` is the response that was provided by the server
  "data": {},

  // `status` is the HTTP status code from the server response
  "status": 200,

  // `headers` the HTTP headers that the server responded with
  // All header names are lower cased and can be accessed using the bracket notation.
  // Example: `response.headers['content-type']`
  "headers": {},

}

```

# Use Response

```yaml
name: Example of cURL action

on: [push]
jobs:
  test-curl-action:
    name: "Perform REST API"
    runs-on: ubuntu-latest
    steps:
      - name: "Call API 1"
        uses: indiesdev/curl@v1.1
        id: api
        with:
          url: https://reqres.in/api/users
          method: "POST"
          accept: 201
          body: '{ "name": "breeze", "job": "devops" }'
          log-response: true
      - name: "Call API 2"
        uses: indiesdev/curl@v1.1
        id: api2
        with:
          url: https://reqres.in/api/users
          method: "POST"
          accept: 201
          # you can use multiline format to construct json data object, the content should be yml format.
          # this format apply to inputs: body, headers and params
          body: |
            name: breeze
            job: devops
          log-response: true
      - name: "Use response"
        run: echo ${{ steps.api.outputs.response }}
```
