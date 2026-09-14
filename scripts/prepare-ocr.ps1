$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$target = Join-Path $projectRoot 'public\ocr'
New-Item -ItemType Directory -Path $target -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $projectRoot 'node_modules\tesseract.js\dist\worker.min.js') -Destination $target
Copy-Item -LiteralPath (Join-Path $projectRoot 'node_modules\tesseract.js\dist\worker.min.js.LICENSE.txt') -Destination $target
foreach ($variant in @('lstm','simd-lstm','relaxedsimd-lstm')) {
    Copy-Item -LiteralPath (Join-Path $projectRoot "node_modules\tesseract.js-core\tesseract-core-$variant.wasm.js") -Destination $target
    Copy-Item -LiteralPath (Join-Path $projectRoot "node_modules\tesseract.js-core\tesseract-core-$variant.wasm") -Destination $target
}
foreach ($lang in @('chi_sim','eng')) {
    Copy-Item -LiteralPath (Join-Path $projectRoot "$lang.traineddata") -Destination $target
}
Write-Output 'Offline OCR assets prepared.'
