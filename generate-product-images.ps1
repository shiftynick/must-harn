<#
.SYNOPSIS
    Generate all product images for Mustache Harnesses Co.

.DESCRIPTION
    Uses gemini-image-gen.ps1 to generate product images for all products.
    Edit the prompts below to tweak the output.

.EXAMPLE
    .\generate-product-images.ps1
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [string]$ApiKey = $env:GEMINI_API_KEY,

    [Parameter(Mandatory = $false)]
    [ValidateSet("gemini", "imagen", "gemini-pro")]
    [string]$Model = "gemini",

    [Parameter(Mandatory = $false)]
    [switch]$DryRun
)

# ============================================================================
# MASTER PROMPT - Applied to all images
# ============================================================================
$MasterPrompt = @"
Professional e-commerce product photography style. Clean white background with subtle shadow.
High-end luxury aesthetic. Crisp, sharp focus. Studio lighting.
The product should look premium and sophisticated, like something from a high-end catalog.
Photorealistic rendering. No text or labels in the image.
"@

# ============================================================================
# PRODUCT IMAGE PROMPTS - Edit these to tweak individual images
# ============================================================================
$ProductPrompts = @{
    # -------------------------------------------------------------------------
    # PRECISION SHAPERS
    # -------------------------------------------------------------------------
    "exec-shaper-pro-1" = @{
        Prompt = "A sleek, professional mustache shaping device made of polished metal and medical-grade silicone. Features precision adjustment dials and elegant curves. Black and silver color scheme."
        AspectRatio = "1:1"
    }
    "exec-shaper-pro-2" = @{
        Prompt = "Close-up detail shot of a premium mustache shaper showing the precision calibration mechanism and aerospace-quality materials. Mahogany wood accents."
        AspectRatio = "1:1"
    }
    "exec-shaper-pro-3" = @{
        Prompt = "A mustache shaping tool displayed at an angle showing its ergonomic design and premium construction. Executive styling with silver metallic finish."
        AspectRatio = "1:1"
    }

    "contour-master-3000-1" = @{
        Prompt = "A sophisticated mustache contouring device with tri-axis adjustment knobs. Precision engineering visible. Onyx black finish with subtle metallic accents."
        AspectRatio = "1:1"
    }
    "contour-master-3000-2" = @{
        Prompt = "Top-down view of a mustache contour shaping tool showing its geometric precision design. Walnut wood finish option with brass fittings."
        AspectRatio = "1:1"
    }

    "precision-arc-trainer-1" = @{
        Prompt = "A futuristic mustache arc training device with graduated resistance bands and chrome finish. Sleek, modern design with visible tension adjustment mechanisms."
        AspectRatio = "1:1"
    }
    "precision-arc-trainer-2" = @{
        Prompt = "A premium mustache training apparatus in matte black finish. Features spring-loaded arc guides and soft silicone contact points."
        AspectRatio = "1:1"
    }
    "precision-arc-trainer-3" = @{
        Prompt = "Elegant rose gold mustache arc trainer device displayed on a marble surface. Luxury grooming tool with adjustable tension springs."
        AspectRatio = "1:1"
    }

    # -------------------------------------------------------------------------
    # CROC-STYLE FUN-CESSORIES
    # -------------------------------------------------------------------------
    "handlebar-croc-1" = @{
        Prompt = "A whimsical face accessory shaped like a Croc shoe but designed to fit over the nose and mouth area. Features ventilation holes specifically positioned to allow a handlebar mustache to poke through. Classic black color with small decorative charms attached."
        AspectRatio = "1:1"
    }
    "handlebar-croc-2" = @{
        Prompt = "A fun face-worn Croc-style accessory in racing red color. Holes are strategically placed for mustache ventilation. Three small jibbitz-style charms visible."
        AspectRatio = "1:1"
    }
    "handlebar-croc-3" = @{
        Prompt = "A playful ocean blue Croc-inspired face accessory with multiple ventilation holes. Lightweight foam construction. Quirky but well-made product."
        AspectRatio = "1:1"
    }

    "ventilated-fun-stache-1" = @{
        Prompt = "A lightweight foam face guard with Swiss-engineered ventilation holes. Tie-dye colorful pattern. Designed to protect mustaches while remaining breathable."
        AspectRatio = "1:1"
    }
    "ventilated-fun-stache-2" = @{
        Prompt = "A camouflage patterned ventilated mustache protector. Foam construction with strategic air holes. Outdoorsy aesthetic."
        AspectRatio = "1:1"
    }

    "swiss-cheese-whisker-wear-1" = @{
        Prompt = "A yellow face accessory designed like Swiss cheese with authentic-looking holes. Playful yet well-crafted product for mustache protection. Holes are mathematically positioned."
        AspectRatio = "1:1"
    }
    "swiss-cheese-whisker-wear-2" = @{
        Prompt = "A white Swiss cheese-inspired facial accessory with precise circular holes. Premium foam material. Whimsical mustache protection device."
        AspectRatio = "1:1"
    }
    "swiss-cheese-whisker-wear-3" = @{
        Prompt = "An orange cheddar-colored version of a cheese-themed face protector with ventilation holes. Fun product photography showing the holes arranged in golden ratio pattern."
        AspectRatio = "1:1"
    }

    # -------------------------------------------------------------------------
    # SUPPORT & LIFT SYSTEMS
    # -------------------------------------------------------------------------
    "elevate-x1-harness-1" = @{
        Prompt = "A sophisticated over-ear harness system with thin titanium cables designed to lift and support facial hair. Professional black color. Industrial-grade but elegant design."
        AspectRatio = "1:1"
    }
    "elevate-x1-harness-2" = @{
        Prompt = "Detail shot of a premium mustache lift harness showing titanium support cables and ergonomic ear hooks. Executive brown leather accents."
        AspectRatio = "1:1"
    }
    "elevate-x1-harness-3" = @{
        Prompt = "A mustache elevation system displayed showing the full harness with adjustable tension cables and over-ear mounting. Medical-grade materials."
        AspectRatio = "1:1"
    }

    "anti-gravity-curl-system-1" = @{
        Prompt = "A futuristic mustache curl support device with magnetic micro-lifters and adjustable tension springs. Stealth black finish. Sci-fi aesthetic."
        AspectRatio = "1:1"
    }
    "anti-gravity-curl-system-2" = @{
        Prompt = "An elegant champagne gold colored mustache curl maintenance system. Features delicate spring mechanisms and magnetic elements. Luxury styling."
        AspectRatio = "1:1"
    }

    "dual-point-lift-apparatus-1" = @{
        Prompt = "A symmetrical mustache lift device with two independent adjustment points. Features a small bubble level for precision. Black industrial design."
        AspectRatio = "1:1"
    }
    "dual-point-lift-apparatus-2" = @{
        Prompt = "A tan colored dual-point mustache lifter showing bilateral support arms and fine adjustment mechanisms. Professional grooming equipment aesthetic."
        AspectRatio = "1:1"
    }
    "dual-point-lift-apparatus-3" = @{
        Prompt = "Detail shot of a gray mustache lift apparatus showing the precision bubble level and independent terminus supports. Engineering-focused design."
        AspectRatio = "1:1"
    }

    # -------------------------------------------------------------------------
    # NIGHT GUARDS & SLEEPWEAR
    # -------------------------------------------------------------------------
    "dreamguard-deluxe-1" = @{
        Prompt = "A premium sleep mask designed for mustache protection. Features a protruding chamber that creates space for facial hair. Midnight blue color with memory foam padding."
        AspectRatio = "1:1"
    }
    "dreamguard-deluxe-2" = @{
        Prompt = "A lavender colored nighttime mustache guard with adjustable straps. Shows the mustache isolation chamber design. Soft, premium materials."
        AspectRatio = "1:1"
    }
    "dreamguard-deluxe-3" = @{
        Prompt = "A charcoal gray overnight mustache protector showing the inner memory foam cushioning and protective dome. Sleep accessory styling."
        AspectRatio = "1:1"
    }

    "nocturnal-curl-protector-1" = @{
        Prompt = "A black sleep device designed to maintain mustache curl overnight. Features curved protective shields and adjustable straps. Technical nightwear aesthetic."
        AspectRatio = "1:1"
    }
    "nocturnal-curl-protector-2" = @{
        Prompt = "A navy blue nighttime curl protection device for mustaches. Sleek design with protective curl chambers. Premium sleep accessory."
        AspectRatio = "1:1"
    }

    "sleepsecure-mustache-bonnet-1" = @{
        Prompt = "An elegant silk sleep bonnet in white with an integrated chin strap and mustache hammock feature. Classic Victorian-inspired design meets modern function."
        AspectRatio = "1:1"
    }
    "sleepsecure-mustache-bonnet-2" = @{
        Prompt = "A blush pink silk sleep bonnet with mustache protection feature. Delicate fabric with integrated facial hair cradle. Elegant sleepwear aesthetic."
        AspectRatio = "1:1"
    }
}

# ============================================================================
# SCRIPT EXECUTION
# ============================================================================

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ImageGenScript = Join-Path $ScriptDir "gemini-image-gen.ps1"
$OutputDir = Join-Path $ScriptDir "images" "products"

# Ensure output directory exists
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    Write-Host "Created output directory: $OutputDir" -ForegroundColor Cyan
}

# Validate API key
if ([string]::IsNullOrEmpty($ApiKey) -and -not $DryRun) {
    Write-Error "API key is required. Set GEMINI_API_KEY environment variable or use -ApiKey parameter."
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Mustache Harnesses Co. - Image Generator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total images to generate: $($ProductPrompts.Count)" -ForegroundColor Gray
Write-Host "Output directory: $OutputDir" -ForegroundColor Gray
Write-Host "Model: $Model" -ForegroundColor Gray
if ($DryRun) {
    Write-Host "MODE: DRY RUN (no images will be generated)" -ForegroundColor Yellow
}
Write-Host ""

$successCount = 0
$failCount = 0
$totalCount = $ProductPrompts.Count
$currentIndex = 0

foreach ($imageName in $ProductPrompts.Keys | Sort-Object) {
    $currentIndex++
    $imageConfig = $ProductPrompts[$imageName]
    $fullPrompt = "$MasterPrompt`n`n$($imageConfig.Prompt)"
    $outputPath = Join-Path $OutputDir "$imageName.png"
    $aspectRatio = if ($imageConfig.AspectRatio) { $imageConfig.AspectRatio } else { "1:1" }

    Write-Host "[$currentIndex/$totalCount] Generating: $imageName" -ForegroundColor Cyan

    if ($DryRun) {
        Write-Host "  Prompt: $($imageConfig.Prompt.Substring(0, [Math]::Min(80, $imageConfig.Prompt.Length)))..." -ForegroundColor Gray
        Write-Host "  Output: $outputPath" -ForegroundColor Gray
        Write-Host "  [SKIPPED - Dry Run]" -ForegroundColor Yellow
        $successCount++
        continue
    }

    try {
        & $ImageGenScript -Prompt $fullPrompt -ApiKey $ApiKey -Model $Model -OutputPath $outputPath -AspectRatio $aspectRatio

        if (Test-Path $outputPath) {
            Write-Host "  SUCCESS: $outputPath" -ForegroundColor Green
            $successCount++
        }
        else {
            Write-Host "  FAILED: Image file not created" -ForegroundColor Red
            $failCount++
        }
    }
    catch {
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }

    # Small delay between API calls to avoid rate limiting
    if (-not $DryRun -and $currentIndex -lt $totalCount) {
        Start-Sleep -Seconds 2
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Generation Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Successful: $successCount" -ForegroundColor Green
if ($failCount -gt 0) {
    Write-Host "Failed: $failCount" -ForegroundColor Red
}
Write-Host ""
