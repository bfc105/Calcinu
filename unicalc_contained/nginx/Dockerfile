FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our config
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy React build
COPY ../frontend/build /usr/share/nginx/html
