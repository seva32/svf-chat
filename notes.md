## Needs key.pem & cert.pem

(.env for path and pass, but if DO nginx takes care of that so use http and not https)

In dev mode comment index.html base tag (not needed if nginx proxies in DO)

<link> <form> dont use /[x], just [x]

nginx for socket.io:

```ruby
location /svfchat/ {
    proxy_pass http://localhost:3003/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;

    subs_filter_types text/css text/xml text/css;
    subs_filter http://$host http://$host/css;

    subs_filter_types text/javascript text/ecmascript application/javascript;
    subs_filter http://$host http://$host/js;
}

location ~* \.io {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-NginX-Proxy false;

    proxy_pass http://localhost:3003;
    proxy_redirect off;

    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

## .env

CHAT_SESSION_SECRET=
CHAT_SESSION_NAME=
CHAT_PORT=
CHAT_NODE_ENV=