# RPC v1

### API connect URLs

-   API HTTP URL: `http://core/api/`
-   API WebSockets URL: `ws://core/api/`

<!-- tabs:start -->

#### **WebSockets**

<!-- prettier-ignore -->
```javascript
import Api from "@softvisio/core/api";

const api = Api.new( "ws://core/api/" )
```

#### **HTTP**

<!-- prettier-ignore -->
```javascript
import Api from "@softvisio/core/api";

const api = Api.new( "http://core/api/" )
```

<!-- tabs:end -->

## Cluster

### Publish event

<!-- tabs:start -->

#### **JavaScript**

<!-- prettier-ignore -->
```javascript
const res = await api.call( "/v1/cluster/publish", name, args? );
```

#### **Shell**

<!-- prettier-ignore -->
```shell
curl \
    -X POST \
    -H "Authorization: Bearer <YOUR-API-TOKEN>" \
    -H "Content-Type: application/json" \
    -d '[name, args?]' \
    "http://core/api/v1/cluster/publish"
```

<!-- tabs:end -->

-   `name` <string\> Event name.
-   `args?` <Buffer\> Array of the event arguments, encoded with `MessagePack`.

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
    "http://core/api/v1/mutex/is-locked"
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
    "http://core/api/v1/mutex/try-down"
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
    "http://core/api/v1/mutex/down"
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
    "http://core/api/v1/mutex/up"
```

<!-- tabs:end -->

-   `mutex_id` <string\> Mutex id.
