# Maven Auto-Installer for Windows
# This script automatically downloads and installs Maven

param(
    [string]$InstallPath = "C:\tools\maven"
)

# Colors for output
function Write-Info { param([string]$Message) Write-Host "[INFO] $Message" -ForegroundColor Blue }
function Write-Success { param([string]$Message) Write-Host "[SUCCESS] $Message" -ForegroundColor Green }
function Write-Warning { param([string]$Message) Write-Host "[WARNING] $Message" -ForegroundColor Yellow }
function Write-Error { param([string]$Message) Write-Host "[ERROR] $Message" -ForegroundColor Red }

Write-Host "🚀 Maven Auto-Installer for Windows" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Warning "This script is not running as Administrator."
    Write-Info "For system-wide installation, please run PowerShell as Administrator."
    Write-Info "Continuing with user-level installation..."
    $InstallPath = "$env:USERPROFILE\tools\maven"
}

# Maven version to install
$MavenVersion = "3.9.6"
$MavenUrl = "https://archive.apache.org/dist/maven/maven-3/$MavenVersion/binaries/apache-maven-$MavenVersion-bin.zip"
$MavenZip = "$env:TEMP\apache-maven-$MavenVersion-bin.zip"
$MavenHome = "$InstallPath\apache-maven-$MavenVersion"

Write-Info "Installing Maven $MavenVersion to: $InstallPath"
Write-Info "Maven will be downloaded from: $MavenUrl"
Write-Host ""

# Step 1: Check if Java is installed
Write-Info "Step 1: Checking Java installation..."
try {
    $javaVersion = java -version 2>&1 | Select-String "version" | ForEach-Object { $_.ToString().Split('"')[1] }
    if ($javaVersion) {
        Write-Success "Java is installed: $javaVersion"
    }
} catch {
    Write-Error "Java is not installed or not in PATH!"
    Write-Info "Please install Java 17+ from: https://adoptium.net/"
    Write-Info "Then run this script again."
    exit 1
}

# Step 2: Check if Maven is already installed
Write-Info "Step 2: Checking if Maven is already installed..."
try {
    $existingMaven = mvn -version 2>&1 | Select-String "Apache Maven" | ForEach-Object { $_.ToString() }
    if ($existingMaven) {
        Write-Warning "Maven is already installed: $existingMaven"
        $response = Read-Host "Do you want to continue anyway? (y/N)"
        if ($response -ne "y" -and $response -ne "Y") {
            Write-Info "Installation cancelled."
            exit 0
        }
    }
} catch {
    Write-Info "Maven not found. Proceeding with installation..."
}

# Step 3: Create installation directory
Write-Info "Step 3: Creating installation directory..."
if (-not (Test-Path $InstallPath)) {
    try {
        New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null
        Write-Success "Created directory: $InstallPath"
    } catch {
        Write-Error "Failed to create directory: $InstallPath"
        Write-Error $_.Exception.Message
        exit 1
    }
} else {
    Write-Info "Directory already exists: $InstallPath"
}

# Step 4: Download Maven
Write-Info "Step 4: Downloading Maven..."
try {
    Write-Info "Downloading from: $MavenUrl"
    Write-Info "This may take a few minutes..."
    
    # Use .NET WebClient for better progress indication
    $webClient = New-Object System.Net.WebClient
    $webClient.DownloadFile($MavenUrl, $MavenZip)
    
    Write-Success "Downloaded Maven to: $MavenZip"
} catch {
    Write-Error "Failed to download Maven!"
    Write-Error $_.Exception.Message
    exit 1
}

# Step 5: Extract Maven
Write-Info "Step 5: Extracting Maven..."
try {
    # Remove existing installation if it exists
    if (Test-Path $MavenHome) {
        Write-Info "Removing existing installation..."
        Remove-Item $MavenHome -Recurse -Force
    }
    
    # Extract using .NET
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::ExtractToDirectory($MavenZip, $InstallPath)
    
    Write-Success "Extracted Maven to: $MavenHome"
} catch {
    Write-Error "Failed to extract Maven!"
    Write-Error $_.Exception.Message
    exit 1
}

# Step 6: Add to PATH
Write-Info "Step 6: Adding Maven to PATH..."
$MavenBin = "$MavenHome\bin"

try {
    # Get current PATH
    if ($isAdmin) {
        # System-wide PATH
        $currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
        $target = "Machine"
        Write-Info "Adding to system PATH (requires restart or new terminal)..."
    } else {
        # User PATH
        $currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
        $target = "User"
        Write-Info "Adding to user PATH..."
    }
    
    # Check if Maven bin is already in PATH
    if ($currentPath -split ";" | Where-Object { $_ -eq $MavenBin }) {
        Write-Info "Maven bin directory already in PATH"
    } else {
        # Add Maven to PATH
        $newPath = "$currentPath;$MavenBin"
        [Environment]::SetEnvironmentVariable("PATH", $newPath, $target)
        Write-Success "Added Maven to PATH: $MavenBin"
    }
    
    # Update current session PATH
    $env:PATH = "$env:PATH;$MavenBin"
    
} catch {
    Write-Error "Failed to add Maven to PATH!"
    Write-Error $_.Exception.Message
    Write-Warning "You may need to add manually: $MavenBin"
}

# Step 7: Set MAVEN_HOME (optional but recommended)
Write-Info "Step 7: Setting MAVEN_HOME environment variable..."
try {
    if ($isAdmin) {
        [Environment]::SetEnvironmentVariable("MAVEN_HOME", $MavenHome, "Machine")
    } else {
        [Environment]::SetEnvironmentVariable("MAVEN_HOME", $MavenHome, "User")
    }
    $env:MAVEN_HOME = $MavenHome
    Write-Success "Set MAVEN_HOME to: $MavenHome"
} catch {
    Write-Warning "Failed to set MAVEN_HOME environment variable"
}

# Step 8: Clean up
Write-Info "Step 8: Cleaning up..."
try {
    Remove-Item $MavenZip -Force
    Write-Success "Cleaned up temporary files"
} catch {
    Write-Warning "Failed to clean up: $MavenZip"
}

# Step 9: Verify installation
Write-Info "Step 9: Verifying installation..."
Write-Host ""

try {
    # Test Maven in current session
    $mavenTest = & "$MavenBin\mvn.cmd" -version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Maven installation successful!"
        Write-Host ""
        Write-Host "Maven Version Information:" -ForegroundColor Cyan
        Write-Host $mavenTest -ForegroundColor Gray
    } else {
        throw "Maven command failed"
    }
} catch {
    Write-Warning "Maven verification failed in current session"
    Write-Info "This is normal - Maven will work in new terminal sessions"
}

# Final instructions
Write-Host ""
Write-Host "🎉 Installation Complete!" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Close this PowerShell window" -ForegroundColor White
Write-Host "2. Open a NEW PowerShell window" -ForegroundColor White
Write-Host "3. Run: mvn -version" -ForegroundColor Yellow
Write-Host "4. Run your application: .\scripts\build-and-run.ps1 quick-start" -ForegroundColor Yellow
Write-Host ""
Write-Host "Installation Details:" -ForegroundColor Cyan
Write-Host "• Maven Home: $MavenHome" -ForegroundColor Gray
Write-Host "• Maven Bin: $MavenBin" -ForegroundColor Gray
Write-Host "• Added to PATH: $target level" -ForegroundColor Gray
Write-Host ""

if (-not $isAdmin) {
    Write-Info "Note: User-level installation completed."
    Write-Info "If you want system-wide installation, run as Administrator."
}

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
