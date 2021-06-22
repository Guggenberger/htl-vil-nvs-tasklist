$TargetPath = Resolve-Path (Join-Path $PSScriptRoot '..')
$ErrorActionPreference = "Stop"
$mainPath = "C:"
$testFolderName = "tmpTestFolderForNVS"

New-Item -Path "$mainPath/" -Name "$testFolderName" -ItemType "directory"
Set-Location -Path "$mainPath/$testFolderName"

git clone https://github.com/htl-vil-informatik/NVS4B-GUGGENBERGER.git
Set-Location NVS4B-GUGGENBERGER/Chat2020

npm install 
npm test
Set-Location $TargetPath