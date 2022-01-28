### React HTTP Fetcher (JSON)

Hook for data fetching in React

Installation:

```bash
npm install --save http-react-fetcher
```

Or

```bash
yarn add http-react-fetcher
```



#### Basic usage

```tsx
import { useFetcher } from "http-react-fetcher"


function App(){

  const { data, loading, error } = useFetcher({
    url: "api-url",
  })

  return (
    <div>
      {
        loading ?
        <p>Loading data...</p > :
          error ?
        <p>Error=(</p> :
        JSON.stringify(data)
      }
    </div>
  )
}

```

#### Default data value

You can set a default value to return as data while the request is completing. If the request fails, however, the `data` prop will be `undefined`


```jsx
  ...

  const { data, loading, error } = useFetcher({
    url: "api-url/posts",
    default: []
  })
  
  ...
```


#### Automatically re-fetch

A new request will always be made if any of the props passed to `useFetcher` changes.

If props won't change but you need refreshing, you can pass a `refresh` prop in the `useFetcher` hook. This is the ammount of seconds to wait until making a new request.


```jsx
  ...

  const { data, loading, error } = useFetcher({
    url: "api-url",
    refresh: 10 // 10 seconds
  })
  
  ...
```

When `refresh` is present, `useFetcher` will do the following:

Example with a refresh of 5 seconds:
- Make an initial request
- After that request is complete, count 5 seconds
- Make another request
- Repeat

#### Manually re-fetching

`useFetcher` also exposes another property, that is `reFetch`, which will make a request when called.

> Note: this will not work if a previous request hasn't been completed yet.

```tsx
import { useFetcher } from "http-react-fetcher"


function App(){

  const { data, loading, error, reFetch } = useFetcher({
    url: "api-url",
  })

  return (
    <div>
    <button onClick={reFetch}>Refresh</button>
      {
        loading ?
        <p>Loading data...</p > :
          error ?
        <p>Error=(</p> :
        JSON.stringify(data)
      }
    </div>
  )
}

```

##### Request configuration

You can pass a `config` prop that has the following type

```ts
type config = {
  method?: "GET" | "POST" | "PUT" ...etc
  headers?: {
    // Request headers
  }
  body?: {
    // A serializable object
  }
}

```

Example

```tsx
...

const { data, loading, error } = useFetcher({
  url: "api-url/posts/search",
  config: {
    method: "POST",
    headers: {
      Authorization: "Token " + user_token
    },
    body: {
      title: '%how to%'
    }
  }
})

...

```


#### Handling error / success

You can pass other props:

`onSuccess(data) { }`: Will run when a request completes succesfuly

`onError(error) { }`: Will run when a request fails


Example:

```tsx
...

const { data, loading, error } = useFetcher({
  url: "api-url/posts/search",
  config: {
    method: "POST",
    headers: {
      Authorization: "Token " + user_token
    },
    body: {
      title: '%how to%'
    }
  },
  onError(err){
    alert("No matches")
    console.error(err.toString())
  },
  onSuccess(posts){
    // Do something with the data
  }
})

...

```

#### TypeScript support

It has full TypeScript support. You can pass a type indicating the data type of the response:


Full example:

```tsx
// TypeScript file
...


interface PostsResponse {
  posts?: {
    title?: string
    content?: string
  }
}

const { data, loading, error } = useFetcher<PostsResponse>({
  url: "api-url/posts/search",
  // If `default` doesn't match type, this will
  // show an error.
  // But if the type argument is not present, the
  // response type will be inferred from `default`
  default: {
    posts: []
  },
  refresh: 10,
  config: {
    method: "POST",
    headers: {
      Authorization: "Token " + user_token
    },
    body: {
      title: '%how to%'
    }
  },
  onError(err){

  },
  // Type of `data` will be `PostsResponse`
  // If a type is not present, its type will
  // be inferred from the `default` prop
  onResolve(data){
    // Do something with the data
  }
})

...

```

#### Non-json data

You can pass a `resolver` prop to handle the response object.

In this example, an image is fetch and converted to a blob url:

```tsx
import { useFetcher } from "http-react-fetcher"

export default function ImageExample() {

  const { data } = useFetcher<string>({
    url: "/cat.png",
    resolver: async (d) => {
      
      // Converting to a blob
      const data = await d.blob()

      // Return the needed format
      return URL.createObjectURL(data)
    },
  })
  return (
    <main>
      <img src={data} alt="" />
    </main>
  )
}

```

If you don't pass a resolver, the `useFetcher` hook will try to read the response data as JSON