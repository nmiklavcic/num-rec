FROM julia:1.11-alpine
WORKDIR /app
COPY Project.toml .
RUN julia --project=. -e "using Pkg; Pkg.instantiate()"
COPY . .
EXPOSE 8000
CMD ["julia", "--project=.", "server.jl"]
