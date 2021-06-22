$TargetPath = Resolve-Path (Join-Path $PSScriptRoot '..')
$ErrorActionPreference = "Stop"
Set-Location -Path c:\
Remove-Item -r -fo tmpTestFolderForNVS -ErrorAction Ignore
Set-Location $TargetPath
Write-Host "testfolder deleted!"