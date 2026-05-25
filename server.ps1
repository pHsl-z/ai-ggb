# Simple HTTP Server using PowerShell
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:8889/")
$listener.Start()

Write-Host "Server running at http://127.0.0.1:8889/"
Write-Host "Press Ctrl+C to stop"

$path = "D:\Onedrive\CODE\AI GGB\GeoChat-project\standalone"

function Get-MimeType($filePath) {
    $ext = [System.IO.Path]::GetExtension($filePath)
    switch ($ext) {
        ".html" { "text/html; charset=utf-8" }
        ".css" { "text/css; charset=utf-8" }
        ".js" { "application/javascript; charset=utf-8" }
        ".json" { "application/json; charset=utf-8" }
        ".png" { "image/png" }
        ".jpg" { "image/jpeg" }
        ".gif" { "image/gif" }
        ".svg" { "image/svg+xml" }
        default { "application/octet-stream" }
    }
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $url = $request.Url.LocalPath
        if ($url -eq "/") { $url = "/index.html" }
        $filePath = Join-Path $path $url.Substring(1)

        if ([System.IO.File]::Exists($filePath)) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = Get-MimeType $filePath
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            $response.StatusCode = 404
            $errorMsg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($errorMsg, 0, $errorMsg.Length)
        }
        $response.Close()
    } catch {
        if ($listener.IsListening) {
            Write-Host "Error: $_"
        }
    }
}
