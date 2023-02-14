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
    -H "Authorization: Bearer <YOUR-API-TOKEN>" \
    "http://core/api/v1/cluster/publish"
```

<!-- tabs:end -->

-   `name` <string\> Event name.

    <details>
        <summary>JSON schema</summary>

    ```json
    {
        "type": "string"
    }
    ```

    </details>

-   `args?` <Buffer\> Array of the event arguments, encoded with `MessagePack`.

    <details>
        <summary>JSON schema</summary>

    ```json
    {
        "instanceof": "Buffer"
    }
    ```

    </details>

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
    -H "Authorization: Bearer <YOUR-API-TOKEN>" \
    "http://core/api/v1/mutex/is-locked"
```

<!-- tabs:end -->

-   `mutex_id` <string\> Mutex id.

    <details>
        <summary>JSON schema</summary>

    ```json
    {
        "type": "string"
    }
    ```

    </details>

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
    -H "Authorization: Bearer <YOUR-API-TOKEN>" \
    "http://core/api/v1/mutex/try-down"
```

<!-- tabs:end -->

-   `mutex_id?` <string\> Mutex id.

    <details>
        <summary>JSON schema</summary>

    ```json
    {
        "type": "string"
    }
    ```

    </details>

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
    -H "Authorization: Bearer <YOUR-API-TOKEN>" \
    "http://core/api/v1/mutex/down"
```

<!-- tabs:end -->

-   `mutex_id?` <string\> Mutex id.

    <details>
        <summary>JSON schema</summary>

    ```json
    {
        "type": "string"
    }
    ```

    </details>

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
    -H "Authorization: Bearer <YOUR-API-TOKEN>" \
    "http://core/api/v1/mutex/up"
```

<!-- tabs:end -->

-   `mutex_id` <string\> Mutex id.

    <details>
        <summary>JSON schema</summary>

    ```json
    {
        "type": "string"
    }
    ```

    </details>
