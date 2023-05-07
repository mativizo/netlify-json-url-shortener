# netlify-json-url-shortener



## URLS

To set the urls use the `urls.json` file. The file contains just an array with objects, like this:
```
[
    {
        slug: "/github",
        url: "https://github.com/mativizo/netlify-json-url-shortener"
    },
    {
        slug: [ "/gh", "gh-profile", "my-github" ],
        url: "github.com/mativizo"
    }
]
```

So, the `url` is a string contains url with, or without `https`/`http` prefix.
The slug is an array or string contains slug(-s).

Example like the above will produce:
- example.com/github -> https://github.com/mativizo/netlify-json-url-shortener
- example.com/gh -> https://github.com/mativizo
- example.com/gh-profile -> https://github.com/mativizo
- example.com/my-github -> https://github.com/mativizo

You can use slugs like:
- `/gh` - with leading slash
- `gh` - without leading slash
- `/gh/mativizo` - with additional slashes