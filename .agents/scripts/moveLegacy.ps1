$root = "C:\Users\Dell\Documents\White-Caves"
$agents = Join-Path $root ".agents"

# Ensure target subfolders exist
foreach($sub in @('docs','plans','scripts')){
  $target = Join-Path $agents $sub
  if(-not (Test-Path $target)){
    New-Item -ItemType Directory -Force -Path $target | Out-Null
  }
}

# Move docs contents
if(Test-Path (Join-Path $root 'docs')){
  Get-ChildItem -Path (Join-Path $root 'docs') -Recurse -File | Move-Item -Destination (Join-Path $agents 'docs') -Force
}

# Move plans contents
if(Test-Path (Join-Path $root 'plans')){
  Get-ChildItem -Path (Join-Path $root 'plans') -Recurse -File | Move-Item -Destination (Join-Path $agents 'plans') -Force
}

# Move scripts contents
if(Test-Path (Join-Path $root 'scripts')){
  Get-ChildItem -Path (Join-Path $root 'scripts') -Recurse -File | Move-Item -Destination (Join-Path $agents 'scripts') -Force
}

# Move loose markdown files from repository root (excluding any already under .agents)
Get-ChildItem -Path $root -Filter *.md -File | Where-Object { $_.FullName -notmatch "\\.agents" } | Move-Item -Destination $agents -Force

