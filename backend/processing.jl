include(joinpath(@__DIR__, "matrices_Ai.jl"))
include(joinpath(@__DIR__, "preprocessing.jl"))

using LinearAlgebra

function flatten_input_image(file)
    "Recieves an image, flattens it and returns the vector"
    img = load(file)
    gray = Gray.(img)
    num = find_boundries(gray)
    imr = resize_image_to_28x28(num)
    flat = mat_to_vec(imr)

    return flat
end

function calculate_best_fit(b)
    A = [A0, A1, A2, A3, A4, A5, A6, A7, A8, A9]
    
    BD = -1 # best digit
    BR = Inf # best residual
    residuals = zeros(10)
    XI = []

    for i in 0:9
        xi = A[i+1] \ b
        residual = norm(b - A[i+1] * xi) # compute the residual | the lower the number the better
        residuals[i+1] = residual #save the residual to the residuals array
        push!(XI,xi)
    end

    BD = argmin(residuals) - 1 # find the best fit based on residuals and save the number
    
    # Convert residuals to probabilites so we can see how close guesses weree to one another
    INV_RES = 1.0 ./ residuals # we invert the residuals so that the best one has the highest value
    PROB = INV_RES ./ sum(INV_RES) # calculate the probability of each number based on residuals
    CONF = PROB[BD+1] # the probability of the number it sees as the best fit
    X = XI[BD+1]

    return BD, CONF, PROB, X
end

function x_to_img(X, BD)
    A = [A0, A1, A2, A3, A4, A5, A6, A7, A8, A9]
    IVEC = A[BD+1] * X # image vector

    IMG = reshape(IVEC, 28, 28)

    # Normalize to [0,1] so values outside that range don't corrupt the PNG
    mn, mx = minimum(IMG), maximum(IMG)
    IMG_norm = (IMG .- mn) ./ (mx - mn + eps())

    tmp = tempname() * ".png"
    save(tmp, Gray.(IMG_norm))
    b64 = base64encode(read(tmp))
    rm(tmp)

    return "data:image/png;base64," * b64
end