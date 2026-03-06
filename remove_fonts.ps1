$dir = "frontend\css"
$skipFiles = @("style.css", "utilities.css", "variables.css")
$files = Get-ChildItem -Path $dir -Recurse -Filter "*.css"

$modifiedCount = 0

# Define a callback for the Regex Replace operation
$evaluator = [System.Text.RegularExpressions.MatchEvaluator] {
    param($m)
    $val = $m.Groups[1].Value.Trim().ToLower()
    if ($val -match "font awesome" -or $val -eq "inherit") {
        return $m.Value
    }
    if ($m.Groups[2].Value -eq '}') {
        return '}'
    }
    return ''
}

$regex = [regex] '(?i)font-family\s*:\s*([^;}]+)(;|\})'

foreach ($file in $files) {
    if ($skipFiles -contains $file.Name) {
        continue
    }

    $content = Get-Content -Raw -Path $file.FullName
    if ($null -eq $content) { continue }
    
    $newContent = $regex.Replace($content, $evaluator)

    if ($newContent -ne $content) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline -Encoding UTF8
        $modifiedCount++
    }
}

Write-Host "Removed hardcoded font-family from $modifiedCount files."
