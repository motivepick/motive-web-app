# Stay Motivated

The service that is going to defeat the laziness.

Try it out on https://motiv.yaskovdev.com.

To run locally run `npm start`.

To deploy to GitHub Pages run `npm run deploy`.


### Local Deployment (for macOS)

1. Copy both `local-motiv.yaskovdev.com.crt` and `local-motiv.yaskovdev.com.key` located near this `README.md` to `/etc/ssl/certs`.
2. Install nginx.
3. Replace `/usr/local/etc/nginx/nginx.conf` file with one located near this `README.md` (consider making a copy of an original `nginx.conf`).
4. Restart nginx (`sudo nginx -s stop` then `sudo nginx`).
5. Edit `hosts` file (`sudo nano /etc/hosts`) and append the `127.0.0.1 local-motiv.yaskovdev.com` line to it.
6. Replace content of `.env` with content of `local.env` (do not commit).
7. Run the application locally with `npm start` and open `https://local-motiv.yaskovdev.com/`. You should see the login page and should be able to login successfully.