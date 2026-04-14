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

    residuals = zeros(10)
    for i in 0:9
        xi = A[i+1] \ b
        residuals[i+1] = norm(b - A[i+1] * xi)
    end

    BD = argmin(residuals) - 1 # best digit (0-indexed)

    # Convert residuals to probabilities (lower residual = higher probability)
    inv_res = 1.0 ./ residuals
    probabilities = inv_res ./ sum(inv_res)
    confidence = probabilities[BD+1]

    return BD, confidence, probabilities
end
