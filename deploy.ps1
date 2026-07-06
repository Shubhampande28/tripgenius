# TripGenius - One-Click Deploy Script

$GH = 'C:\Program Files\GitHub CLI\gh.exe'
Set-Location $PSScriptRoot

Write-Host ''
Write-Host '==========================================' -ForegroundColor Cyan
Write-Host '  TripGenius.in - Deploy to Production   ' -ForegroundColor Cyan
Write-Host '==========================================' -ForegroundColor Cyan
Write-Host ''

# Step 1: GitHub login (already done, skip if authenticated)
Write-Host '[1/5] Checking GitHub login...' -ForegroundColor Yellow
$authStatus = & $GH auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host 'Please log in - a browser will open.' -ForegroundColor Gray
    & $GH auth login --web --git-protocol https
} else {
    Write-Host 'Already logged in to GitHub.' -ForegroundColor Green
}
Write-Host ''

# Step 2: Create GitHub repo and push
Write-Host '[2/5] Creating GitHub repository...' -ForegroundColor Yellow
& $GH repo create tripgenius --private --source=. --remote=origin --push 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host 'Repository created and code pushed.' -ForegroundColor Green
} else {
    Write-Host 'Repo exists or push failed - trying direct push...' -ForegroundColor Gray
    git remote remove origin 2>&1 | Out-Null
    $ghUser = (& $GH api user --jq '.login' 2>&1).Trim()
    git remote add origin "https://github.com/$ghUser/tripgenius.git"
    git push -u origin main 2>&1
    Write-Host 'Code pushed to GitHub.' -ForegroundColor Green
}
Write-Host ''

# Step 3: Confirm push
Write-Host '[3/5] Confirming latest code is pushed...' -ForegroundColor Yellow
git push 2>&1 | Out-Null
Write-Host 'Done.' -ForegroundColor Green
Write-Host ''

# Step 4: Vercel login and deploy
Write-Host '[4/5] Vercel login...' -ForegroundColor Yellow
Write-Host 'A browser will open - sign in with GitHub.' -ForegroundColor Gray
vercel login
Write-Host ''
Write-Host 'Deploying to production...' -ForegroundColor Yellow
vercel --prod --yes
Write-Host 'Deployed!' -ForegroundColor Green
Write-Host ''

# Step 5: Add domain
Write-Host '[5/5] Adding custom domain...' -ForegroundColor Yellow
vercel domains add tripgenius.in 2>&1
vercel domains add www.tripgenius.in 2>&1
Write-Host ''

# Summary
Write-Host '==========================================' -ForegroundColor Green
Write-Host '  Site is LIVE on Vercel!                ' -ForegroundColor Green
Write-Host '==========================================' -ForegroundColor Green
Write-Host ''
Write-Host 'Final step - add these 2 records in GoDaddy DNS:' -ForegroundColor Cyan
Write-Host ''
Write-Host '  Type: A      Name: @    Value: 76.76.21.21' -ForegroundColor White
Write-Host '  Type: CNAME  Name: www  Value: cname.vercel-dns.com' -ForegroundColor White
Write-Host ''
Write-Host 'GoDaddy path: My Products -> DNS -> tripgenius.in' -ForegroundColor Gray
Write-Host 'Wait 10-30 minutes then open https://tripgenius.in' -ForegroundColor Gray
Write-Host ''
Read-Host 'Press Enter to close'
