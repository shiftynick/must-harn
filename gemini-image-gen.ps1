<#
.SYNOPSIS
    Generate images using Google Gemini API (Nano Banana) or Imagen API.

.DESCRIPTION
    This script calls the Google Gemini/Imagen API to generate images from text prompts.
    Supports both Gemini 2.5 Flash Image (Nano Banana) and Imagen 4 models.
    Optionally accepts a reference image for style/content consistency.

.PARAMETER Prompt
    The text prompt describing the image to generate.

.PARAMETER ApiKey
    Your Google Gemini API key. Can also be set via GEMINI_API_KEY environment variable.

.PARAMETER Model
    The model to use: "gemini" (default) for Gemini 2.5 Flash Image, or "imagen" for Imagen 4.

.PARAMETER OutputPath
    Path where the generated image will be saved. Default: "generated_image.png"

.PARAMETER ReferenceImage
    Optional path to a reference image for style/content consistency. Only supported with Gemini models.

.PARAMETER AspectRatio
    Aspect ratio for the image. Options: "1:1", "3:4", "4:3", "9:16", "16:9" (default: "1:1")

.PARAMETER ImageSize
    Resolution of the generated image. Options: "1K", "2K", "4K" (default: "1K")
    Note: 4K only available with Gemini 3 Pro model.

.PARAMETER NumberOfImages
    Number of images to generate (1-4). Only applies to Imagen model. Default: 1

.EXAMPLE
    .\gemini-image-gen.ps1 -Prompt "A futuristic city at sunset" -ApiKey "your-api-key"

.EXAMPLE
    .\gemini-image-gen.ps1 -Prompt "A cute robot" -Model "imagen" -AspectRatio "16:9" -NumberOfImages 2

.EXAMPLE
    .\gemini-image-gen.ps1 -Prompt "Same product from a different angle" -ReferenceImage "product1.png"
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Prompt,

    [Parameter(Mandatory = $false)]
    [string]$ApiKey = $env:GEMINI_API_KEY,

    [Parameter(Mandatory = $false)]
    [ValidateSet("gemini", "imagen", "gemini-pro")]
    [string]$Model = "gemini",

    [Parameter(Mandatory = $false)]
    [string]$OutputPath = "generated_image.png",

    [Parameter(Mandatory = $false)]
    [string]$ReferenceImage,

    [Parameter(Mandatory = $false)]
    [ValidateSet("1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9")]
    [string]$AspectRatio = "1:1",

    [Parameter(Mandatory = $false)]
    [ValidateSet("1K", "2K", "4K")]
    [string]$ImageSize = "1K",

    [Parameter(Mandatory = $false)]
    [ValidateRange(1, 4)]
    [int]$NumberOfImages = 1
)

# Validate API key
if ([string]::IsNullOrEmpty($ApiKey)) {
    Write-Error "API key is required. Provide via -ApiKey parameter or set GEMINI_API_KEY environment variable."
    exit 1
}

# Define endpoints based on model
$endpoints = @{
    "gemini"     = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent"
    "gemini-pro" = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent"
    "imagen"     = "https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict"
}

$endpoint = $endpoints[$Model]

# Build request headers
$headers = @{
    "x-goog-api-key" = $ApiKey
    "Content-Type"   = "application/json"
}

# Warn if reference image used with Imagen (not supported)
if ($Model -eq "imagen" -and -not [string]::IsNullOrEmpty($ReferenceImage)) {
    Write-Warning "Reference images are only supported with Gemini models. The reference image will be ignored."
}

# Build request body based on model type
if ($Model -eq "imagen") {
    # Imagen API format
    $body = @{
        instances  = @(
            @{
                prompt = $Prompt
            }
        )
        parameters = @{
            sampleCount = $NumberOfImages
            aspectRatio = $AspectRatio
        }
    }

    # Add imageSize if not 1K (1K is default)
    if ($ImageSize -ne "1K") {
        $body.parameters.imageSize = $ImageSize
    }
}
else {
    # Gemini (Nano Banana) API format
    $parts = @(
        @{
            text = $Prompt
        }
    )

    # Add reference image if provided
    if (-not [string]::IsNullOrEmpty($ReferenceImage)) {
        if (-not (Test-Path $ReferenceImage)) {
            Write-Error "Reference image not found: $ReferenceImage"
            exit 1
        }

        Write-Host "Using reference image: $ReferenceImage" -ForegroundColor Gray

        # Read and encode the reference image
        $refImageBytes = [System.IO.File]::ReadAllBytes($ReferenceImage)
        $refImageBase64 = [Convert]::ToBase64String($refImageBytes)

        # Determine MIME type from extension
        $refExtension = [System.IO.Path]::GetExtension($ReferenceImage).ToLower()
        $refMimeType = switch ($refExtension) {
            ".png" { "image/png" }
            ".jpg" { "image/jpeg" }
            ".jpeg" { "image/jpeg" }
            ".webp" { "image/webp" }
            default { "image/png" }
        }

        $parts += @{
            inline_data = @{
                mime_type = $refMimeType
                data      = $refImageBase64
            }
        }
    }

    $body = @{
        contents         = @(
            @{
                parts = $parts
            }
        )
        generationConfig = @{
            responseModalities = @("TEXT", "IMAGE")
            imageConfig        = @{
                aspectRatio = $AspectRatio
                imageSize   = $ImageSize
            }
        }
    }
}

$jsonBody = $body | ConvertTo-Json -Depth 10

Write-Host "Generating image with $Model model..." -ForegroundColor Cyan
Write-Host "Prompt: $Prompt" -ForegroundColor Gray
Write-Host "Aspect Ratio: $AspectRatio | Size: $ImageSize" -ForegroundColor Gray

try {
    # Make the API request
    $response = Invoke-RestMethod -Uri $endpoint -Method Post -Headers $headers -Body $jsonBody -ErrorAction Stop

    # Extract and save image(s) based on model type
    $imageCount = 0

    if ($Model -eq "imagen") {
        # Imagen response format
        if ($response.predictions) {
            foreach ($prediction in $response.predictions) {
                $imageCount++
                $imageData = $prediction.bytesBase64Encoded

                if ($imageData) {
                    $outputFile = if ($NumberOfImages -gt 1) {
                        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($OutputPath)
                        $extension = [System.IO.Path]::GetExtension($OutputPath)
                        $directory = [System.IO.Path]::GetDirectoryName($OutputPath)
                        if ([string]::IsNullOrEmpty($directory)) { $directory = "." }
                        Join-Path $directory "$baseName`_$imageCount$extension"
                    }
                    else {
                        $OutputPath
                    }

                    $imageBytes = [Convert]::FromBase64String($imageData)
                    [System.IO.File]::WriteAllBytes($outputFile, $imageBytes)
                    Write-Host "Image saved to: $outputFile" -ForegroundColor Green
                }
            }
        }
    }
    else {
        # Gemini (Nano Banana) response format
        if ($response.candidates) {
            foreach ($candidate in $response.candidates) {
                foreach ($part in $candidate.content.parts) {
                    # Check for both property naming conventions (inlineData vs inline_data, mimeType vs mime_type)
                    $inlineData = if ($part.inlineData) { $part.inlineData } elseif ($part.inline_data) { $part.inline_data } else { $null }

                    if ($inlineData -and $inlineData.data) {
                        $imageCount++
                        $imageData = $inlineData.data
                        $mimeType = if ($inlineData.mimeType) { $inlineData.mimeType } elseif ($inlineData.mime_type) { $inlineData.mime_type } else { "image/png" }

                        # Determine file extension from mime type
                        $extension = switch ($mimeType) {
                            "image/png" { ".png" }
                            "image/jpeg" { ".jpg" }
                            "image/webp" { ".webp" }
                            default { ".png" }
                        }

                        $outputFile = if ($imageCount -gt 1) {
                            $baseName = [System.IO.Path]::GetFileNameWithoutExtension($OutputPath)
                            $directory = [System.IO.Path]::GetDirectoryName($OutputPath)
                            if ([string]::IsNullOrEmpty($directory)) { $directory = "." }
                            Join-Path $directory "$baseName`_$imageCount$extension"
                        }
                        else {
                            # Update extension if needed
                            $baseName = [System.IO.Path]::GetFileNameWithoutExtension($OutputPath)
                            $directory = [System.IO.Path]::GetDirectoryName($OutputPath)
                            if ([string]::IsNullOrEmpty($directory)) { $directory = "." }
                            Join-Path $directory "$baseName$extension"
                        }

                        $imageBytes = [Convert]::FromBase64String($imageData)
                        [System.IO.File]::WriteAllBytes($outputFile, $imageBytes)
                        Write-Host "Image saved to: $outputFile" -ForegroundColor Green
                    }
                    elseif ($part.text) {
                        Write-Host "Model response: $($part.text)" -ForegroundColor Yellow
                    }
                }
            }
        }
    }

    if ($imageCount -eq 0) {
        Write-Warning "No images were generated. The API response may not contain image data."
        # Save response to file for debugging (don't output to console as it may contain large base64 data)
        $debugFile = "gemini_debug_response.json"
        $response | ConvertTo-Json -Depth 10 | Out-File -FilePath $debugFile -Encoding UTF8
        Write-Host "Debug: Response saved to $debugFile for inspection" -ForegroundColor Gray
    }
    else {
        Write-Host "`nSuccessfully generated $imageCount image(s)!" -ForegroundColor Green
    }
}
catch {
    $errorMessage = $_.Exception.Message

    # Try to parse error response for more details
    if ($_.ErrorDetails.Message) {
        Write-Host "API Error Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
        try {
            $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
            if ($errorDetails.error.message) {
                $errorMessage = $errorDetails.error.message
            }
        }
        catch {
            # Use original error message if parsing fails
        }
    }

    Write-Error "Failed to generate image: $errorMessage"
    exit 1
}
