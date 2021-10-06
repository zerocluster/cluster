# RPC v1

### API connect URLs

-   API HTTP URL: `http://domain:8080/`
-   API WebSockets URL: `ws://domain:8080/`

<!-- tabs:start -->

#### **WebSockets**

<!-- prettier-ignore -->
```javascript
import Api from "@softvisio/core/api";

const api = Api.new( "ws://domain:8080/" )
```

#### **HTTP**

<!-- prettier-ignore -->
```javascript
import Api from "@softvisio/core/api";

const api = Api.new( "http://domain:8080/" )
```

<!-- tabs:end -->

## Shared mutex

### Check if mutex is locked

<!-- tabs:start -->

#### **JavaScript**

<!-- prettier-ignore -->
```javascript
const res = await api.call( "/v1/mutex/is-locked", mutex_id );
```

#### **Shell**

<!-- prettier-ignore -->
```shell
curl \
    -X POST \
    -H "Authorization: Bearer <YOUR-API-TOKEN>" \
    -H "Content-Type: application/json" \
    -d '[mutex_id]' \
    "http://domain:8080/v1/mutex/is-locked"
```

<!-- tabs:end -->

-   `mutex_id` <string\> Mutex id.

### Try down mutex

<!-- tabs:start -->

#### **JavaScript**

<!-- prettier-ignore -->
```javascript
const res = await api.call( "/v1/mutex/try-down", mutex_id? );
```

#### **Shell**

<!-- prettier-ignore -->
```shell
curl \
    -X POST \
    -H "Authorization: Bearer <YOUR-API-TOKEN>" \
    -H "Content-Type: application/json" \
    -d '[mutex_id?]' \
    "http://domain:8080/v1/mutex/try-down"
```

<!-- tabs:end -->

-   `mutex_id?` <string\> Mutex id.

### Down mutex

<!-- tabs:start -->

#### **JavaScript**

<!-- prettier-ignore -->
```javascript
const res = await api.call( "/v1/mutex/down", mutex_id? );
```

#### **Shell**

<!-- prettier-ignore -->
```shell
curl \
    -X POST \
    -H "Authorization: Bearer <YOUR-API-TOKEN>" \
    -H "Content-Type: application/json" \
    -d '[mutex_id?]' \
    "http://domain:8080/v1/mutex/down"
```

<!-- tabs:end -->

-   `mutex_id?` <string\> Mutex id.

### Up mutex

<!-- tabs:start -->

#### **JavaScript**

<!-- prettier-ignore -->
```javascript
const res = await api.call( "/v1/mutex/up", mutex_id );
```

#### **Shell**

<!-- prettier-ignore -->
```shell
curl \
    -X POST \
    -H "Authorization: Bearer <YOUR-API-TOKEN>" \
    -H "Content-Type: application/json" \
    -d '[mutex_id]' \
    "http://domain:8080/v1/mutex/up"
```

<!-- tabs:end -->

-   `mutex_id` <string\> Mutex id.
