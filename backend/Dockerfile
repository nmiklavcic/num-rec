FROM julia:1.10
WORKDIR /app
COPY . .
RUN julia --project=. setup.jl
EXPOSE 8000
CMD ["julia", "--project=.", "server.jl"]
