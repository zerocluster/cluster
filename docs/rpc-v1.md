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

## Events pub/sub

### Subscribe to the events

<!-- tabs:start -->

#### **JavaScript**

<!-- prettier-ignore -->
```javascript
const res = await api.call( "/v1/events/subscribe", events );
```

#### **Shell**

<!-- prettier-ignore -->
```shell
curl \
    -X POST \
    -H "Authorization: Bearer <YOUR-API-TOKEN>" \
    -H "Content-Type: application/json" \
    -d '[events]' \
    "http://domain:8080/v1/events/subscribe"
```

<!-- tabs:end -->

-   `events` <Array\> Events names to subscribe.

### Unsubscribe from the events

<!-- tabs:start -->

#### **JavaScript**

<!-- prettier-ignore -->
```javascript
const res = await api.call( "/v1/events/unsubscribe", events );
```

#### **Shell**

<!-- prettier-ignore -->
```shell
curl \
    -X POST \
    -H "Authorization: Bearer <YOUR-API-TOKEN>" \
    -H "Content-Type: application/json" \
    -d '[events]' \
    "http://domain:8080/v1/events/unsubscribe"
```

<!-- tabs:end -->

-   `events` <Array\> Events names to unsubscribe.

### Publish event

<!-- tabs:start -->

#### **JavaScript**

<!-- prettier-ignore -->
```javascript
const res = await api.call( "/v1/events/publish", name, args? );
```

#### **Shell**

<!-- prettier-ignore -->
```shell
curl \
    -X POST \
    -H "Authorization: Bearer <YOUR-API-TOKEN>" \
    -H "Content-Type: application/json" \
    -d '[name, args?]' \
    "http://domain:8080/v1/events/publish"
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
