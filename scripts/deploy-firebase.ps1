param(
  [string]$ProjectId = "clinic-appointment-booki-15481",
  [string]$SeedToken = $env:FIRST_ADMIN_SETUP_TOKEN,
  [switch]$SkipSeed
)

$ErrorActionPreference = "Stop"

Write-Host "Checking Firebase authentication..."
$projects = npx firebase-tools projects:list --json | ConvertFrom-Json
if ($projects.status -eq "error") {
  throw "Firebase CLI is not authenticated. Run: npx firebase-tools login"
}

Write-Host "Building React app..."
npm run build

Write-Host "Deploying Firebase Hosting, Functions, Firestore rules, and Storage rules..."
npx firebase-tools deploy --project $ProjectId

if (-not $SkipSeed) {
  if (-not $SeedToken) {
    Write-Warning "Skipping demo seed because FIRST_ADMIN_SETUP_TOKEN was not provided."
    exit 0
  }

  $seedUrl = "https://asia-south1-$ProjectId.cloudfunctions.net/api/clinic/seed-demo-data/"
  Write-Host "Seeding Firestore demo data..."
  Invoke-RestMethod `
    -Method Post `
    -Uri $seedUrl `
    -ContentType "application/json" `
    -Body (@{ setupToken = $SeedToken } | ConvertTo-Json)
}

Write-Host "Firebase deployment completed."
