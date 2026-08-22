# PowerShell script to push to GitHub

$repoPath = "C:\Users\NCC-2026\Desktop\Android"
$logFile = "$repoPath\push.log"

# Change to repo directory
Set-Location $repoPath

# Log function
function Log {
    param([string]$message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp : $message" | Out-File -Append -FilePath $logFile -Encoding UTF8
    Write-Host "$timestamp : $message"
}

Log "========== Starting Git Push =========="
Log "Repository: $repoPath"
Log ""

# Check git status
Log "Checking Git Status..."
$status = & git status --porcelain
if ($status) {
    Log "Uncommitted changes found:"
    Log $status
} else {
    Log "Working directory is clean."
}

Log ""
Log "Current branch:"
$branch = & git rev-parse --abbrev-ref HEAD
Log $branch

Log ""
Log "Latest commits:"
& git log --oneline -5 | ForEach-Object { Log $_ }

Log ""
Log "Attempting to push to GitHub..."
try {
    # Attempt push
    $pushResult = & git push origin main -v 2>&1
    Log "Push command executed."
    if ($pushResult) {
        Log "Push output:"
        $pushResult | ForEach-Object { Log $_ }
    } else {
        Log "Push completed with no output (may indicate success)."
    }
}
catch {
    Log "Error during push: $_"
}

Log ""
Log "Checking remote tracking branches..."
$remoteBranches = & git branch -r
$remoteBranches | ForEach-Object { Log $_ }

Log ""
Log "========== Push Script Completed =========="

# Read and display the log
Write-Host ""
Write-Host "=== Full Log Content ===" 
Get-Content $logFile
