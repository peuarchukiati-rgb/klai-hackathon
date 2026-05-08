# klai · OpenAI image generation (PowerShell)
# Usage: .\scripts\gen-images.ps1
#        .\scripts\gen-images.ps1 -Only hero
#        .\scripts\gen-images.ps1 -Model dall-e-3

param(
    [string]$Only = $null,
    [string]$Model = $null
)

$ErrorActionPreference = "Stop"

# --- locate project root ---
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Root = Split-Path -Parent $ScriptDir
$OutDir = Join-Path $Root "public\images"

# --- load .env.local ---
$envPath = Join-Path $Root ".env.local"
if (Test-Path $envPath) {
    Get-Content $envPath | ForEach-Object {
        if ($_ -match '^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$') {
            $name = $matches[1]
            $value = $matches[2].Trim('"').Trim("'")
            if (-not (Get-Item "Env:$name" -ErrorAction SilentlyContinue)) {
                Set-Item "Env:$name" $value
            }
        }
    }
}

$KEY = $env:OPENAI_API_KEY
if (-not $KEY -or $KEY.StartsWith("sk-REPLACE")) {
    Write-Host ""
    Write-Host "ERROR: OPENAI_API_KEY not found" -ForegroundColor Red
    Write-Host "  Set it in .env.local: OPENAI_API_KEY=sk-..."
    Write-Host ""
    exit 1
}

if (-not $Model) { $Model = if ($env:OPENAI_IMAGE_MODEL) { $env:OPENAI_IMAGE_MODEL } else { "gpt-image-1" } }

# --- prompts ---
$Prompts = @(
    @{
        name = "hero"
        size = "1024x1536"
        prompt = "A serene editorial photo of a person in their early 30s sitting calmly by a large window at golden hour, holding a phone displaying soft glowing health data (sleep score, HRV, steps) overlaid in clean minimal typography. Warm cream and forest green tones, soft natural light, slightly desaturated, premium wellness magazine aesthetic, shallow depth of field, no logos, no text artifacts. Mood: calm, intentional, modern."
    },
    @{
        name = "devices"
        size = "1024x1024"
        prompt = "Editorial flat lay on a warm cream linen surface: an Apple Watch, an iPhone showing a minimal health dashboard, a Garmin watch, a Withings smart scale, a small potted eucalyptus plant. Top-down view, soft natural daylight, muted forest green and coral accent, no logos visible, premium minimal styling, intentional negative space. Mood: organized, calm, considered."
    },
    @{
        name = "how-it-works"
        size = "1024x1024"
        prompt = "Abstract minimal illustration showing three soft organic shapes connected by a thin flowing line. First shape contains a watch silhouette, second shape contains a chat bubble, third shape contains a document icon. Cream background, forest green and coral palette, hand-drawn quality, calm wellness aesthetic, lots of whitespace, no text."
    },
    @{
        name = "cta-bg"
        size = "1536x1024"
        prompt = "Abstract atmospheric background: soft out-of-focus eucalyptus leaves and gentle morning light rays, deep forest green tones with warm coral highlights at the edges. Premium editorial photography, cinematic, peaceful, no people, no text, suitable as a banner background."
    },
    @{
        name = "samples-cover"
        size = "1024x1024"
        prompt = "An open laptop and a notebook with handwritten markdown-style notes, on a warm cream desk surface beside a cup of green tea. Soft warm light from the side, top-down close-up, premium minimal aesthetic, forest green plant in corner, no logos, no text artifacts. Mood: focused, calm productivity."
    }
)

if ($Only) {
    $Prompts = $Prompts | Where-Object { $_.name -eq $Only }
    if (-not $Prompts) {
        Write-Host "No prompt named '$Only'" -ForegroundColor Red
        exit 1
    }
}

# --- ensure output dir ---
New-Item -ItemType Directory -Path $OutDir -Force | Out-Null

Write-Host ""
Write-Host "klai image generation" -ForegroundColor Green
Write-Host "  model:  $Model"
Write-Host "  output: $OutDir"
Write-Host "  prompts: $(($Prompts | ForEach-Object { $_.name }) -join ', ')"
Write-Host ""

foreach ($p in $Prompts) {
    Write-Host "  - $($p.name).png ... " -NoNewline
    $t0 = Get-Date

    try {
        $body = @{
            model = $Model
            prompt = $p.prompt
            size = $p.size
            n = 1
        }
        if ($Model -ne "gpt-image-1") {
            $body.response_format = "b64_json"
        }
        $bodyJson = $body | ConvertTo-Json -Depth 10 -Compress

        $headers = @{
            "Authorization" = "Bearer $KEY"
            "Content-Type" = "application/json"
        }

        $response = Invoke-RestMethod `
            -Uri "https://api.openai.com/v1/images/generations" `
            -Method Post `
            -Headers $headers `
            -Body $bodyJson `
            -TimeoutSec 180

        $item = $response.data[0]
        $outPath = Join-Path $OutDir "$($p.name).png"

        if ($item.b64_json) {
            $bytes = [Convert]::FromBase64String($item.b64_json)
            [System.IO.File]::WriteAllBytes($outPath, $bytes)
        } elseif ($item.url) {
            Invoke-WebRequest -Uri $item.url -OutFile $outPath -TimeoutSec 60
        } else {
            Write-Host "FAIL: no image in response" -ForegroundColor Red
            continue
        }

        $size = (Get-Item $outPath).Length / 1KB
        $dur = ((Get-Date) - $t0).TotalSeconds
        Write-Host ("OK {0:N0} KB, {1:N1}s" -f $size, $dur) -ForegroundColor Green
    }
    catch {
        $errMsg = $_.Exception.Message
        if ($_.ErrorDetails) {
            $errMsg = $_.ErrorDetails.Message
        }
        Write-Host "FAIL: $($errMsg.Substring(0, [Math]::Min(200, $errMsg.Length)))" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Done. Images saved to public/images/" -ForegroundColor Green
Write-Host ""
