#!/bin/bash

# Script pour exécuter les scripts de tracking avec les variables d'environnement
# Usage: ./run_scripts.sh [script_name]

# Charger les variables d'environnement depuis .env.local
if [ -f .env.local ]; then
    source .env.local
fi

# Exporter les variables pour Node.js
export NEXT_PUBLIC_SUPABASE_URL
export NEXT_PUBLIC_SUPABASE_ANON_KEY
export SUPABASE_SERVICE_ROLE_KEY

echo "🚀 Exécution avec les variables d'environnement chargées..."

# Vérifier quel script exécuter
case "$1" in
    "cleanup")
        echo "🧹 Nettoyage des doublons de leads..."
        node cleanup_duplicate_leads.js
        ;;
    "recalculate")
        echo "📊 Recalcul des totaux uniques..."
        node recalculate_unique_totals.js
        ;;
    "test")
        echo "🧪 Test du système de tracking..."
        node test_unique_tracking.js
        ;;
    "test-original")
        echo "🧪 Test original du système..."
        node test_tracking.js
        ;;
    "test-verification")
        echo "🧪 Test de vérification..."
        node test_verification_tracking.js
        ;;
    *)
        echo "Usage: $0 {cleanup|recalculate|test|test-original|test-verification}"
        echo ""
        echo "Scripts disponibles:"
        echo "  cleanup         - Nettoie et fusionne les doublons de leads"
        echo "  recalculate     - Recalcule les totaux basés sur les IP uniques"
        echo "  test            - Teste le nouveau système de tracking"
        echo "  test-original   - Test original du système"
        echo "  test-verification - Test de vérification"
        exit 1
        ;;
esac 