FROM julia:1.10
WORKDIR /app
COPY Project.toml setup.jl ./
RUN julia --project=. setup.jl
COPY . .
EXPOSE 8000
CMD ["julia", "--project=.", "server.jl"]
