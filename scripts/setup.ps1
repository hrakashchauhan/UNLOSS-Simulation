$ErrorActionPreference = 'Stop'
$project = Split-Path -Parent $PSScriptRoot
$api = Join-Path $project 'api'
$envPath = Join-Path $api '.env'
if (-not (Test-Path -LiteralPath $envPath)) {
  $secretBytes = New-Object byte[] 48
  [System.Security.Cryptography.RandomNumberGenerator]::Fill($secretBytes)
  $secret = [Convert]::ToBase64String($secretBytes).TrimEnd('=').Replace('+','-').Replace('/','_')
  @"
DATABASE_URL="file:../unloss-simulation.db"
SESSION_SECRET="$secret"
SEED_PASSWORD="ParcelDemo!2026"
PORT=3002
NODE_ENV=development
DEMO_MODE=true
"@ | Set-Content -LiteralPath $envPath -Encoding utf8
}
npm install --prefix $api
npm install --prefix (Join-Path $project 'web')
Push-Location $api
try {
  npm exec -- prisma generate --schema prisma/schema.prisma
  npm run db:migrate
  npm run db:seed
} finally {
  Pop-Location
}
