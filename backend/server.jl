using HTTP
using JSON3
using Base64

const PORT = 8000
const ALLOWED_ORIGIN = "https://num-rec.nmiklavcic.com"

function returnCors()
    return [
        "Access-Control-Allow-Origin"  => ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods" => "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers" => "Content-Type",
        "Content-Type"                 => "application/json"
    ]
end

function healthHandler(req)
    return HTTP.Response(200, returnCors(), JSON3.write(Dict("status" => "ok")))
end

function contributeHandler(req)
    try
        body = JSON3.read(String(req.body))
        digit = body["digit"]
        image = body["image"]
        raw = split(image, ",")[2]
        img_bytes = base64decode(raw)

        folder = "data/$(digit)"
        mkpath(folder)
        filename = "$(folder)/$(time_ns()).png"
        open(filename, "w") do f
            write(f, img_bytes)
        end
        return HTTP.Response(200, returnCors(), JSON3.write(Dict("status" => "success")))
    catch e
        return HTTP.Response(500, returnCors(), JSON3.write(Dict("status" => "error", "message" => string(e))))
    end
end

function optionsHandler(req)
    return HTTP.Response(204, returnCors(), "")
end

function router(req)
    if req.method == "OPTIONS"
        return optionsHandler(req)
    elseif req.method == "GET" && req.target == "/health"
        return healthHandler(req)
    elseif req.method == "POST" && req.target == "/contribute"
        return contributeHandler(req)
    else
        return HTTP.Response(404, returnCors(), JSON3.write(Dict("status" => "error", "message" => "Not Found")))
    end
end

# Server start
HTTP.serve(router, "0.0.0.0", PORT)