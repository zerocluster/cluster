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

### Try lock mutex

<!-- tabs:start -->

#### **JavaScript**

<!-- prettier-ignore -->
```javascript
const res = await api.call( "/v1/mutex/try-lock", mutex_id? );
```

#### **Shell**

<!-- prettier-ignore -->
```shell
curl \
    -H "Authorization: Bearer <YOUR-API-TOKEN>" \
    "http://core/api/v1/mutex/try-lock"
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

### Lock mutex

<!-- tabs:start -->

#### **JavaScript**

<!-- prettier-ignore -->
```javascript
const res = await api.call( "/v1/mutex/lock", mutex_id? );
```

#### **Shell**

<!-- prettier-ignore -->
```shell
curl \
    -H "Authorization: Bearer <YOUR-API-TOKEN>" \
    "http://core/api/v1/mutex/lock"
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

### Unlock mutex

<!-- tabs:start -->

#### **JavaScript**

<!-- prettier-ignore -->
```javascript
const res = await api.call( "/v1/mutex/unlock", mutex_id );
```

#### **Shell**

<!-- prettier-ignore -->
```shell
curl \
    -H "Authorization: Bearer <YOUR-API-TOKEN>" \
    "http://core/api/v1/mutex/unlock"
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
