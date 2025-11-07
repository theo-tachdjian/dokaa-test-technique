# Script PowerShell pour réinitialiser le circuit breaker
$response = Invoke-WebRequest -Uri "http://localhost:3001/api/restaurants/reset-circuit-breaker" -Method POST -ContentType "application/json"

if ($response.StatusCode -eq 200) {
    $data = $response.Content | ConvertFrom-Json
    if ($data.success) {
        Write-Host "`n✅ Circuit breaker réinitialisé avec succès !" -ForegroundColor Green
        Write-Host "💡 Vous pouvez maintenant réessayer vos requêtes.`n" -ForegroundColor Cyan
    } else {
        Write-Host "`n❌ Erreur lors de la réinitialisation: $($data.error)`n" -ForegroundColor Red
    }
} else {
    Write-Host "`n❌ Erreur HTTP: $($response.StatusCode)`n" -ForegroundColor Red
}

