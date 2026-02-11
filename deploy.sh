#!/bin/bash
# Script de déploiement Netlify

echo "🚀 Déploiement du site HelixOne sur Netlify..."

# Vérifier si netlify CLI est installé
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI n'est pas installé"
    echo "📦 Installation de Netlify CLI..."
    npm install -g netlify-cli
fi

# Déployer
echo "📤 Déploiement en cours..."
netlify deploy --prod --dir=.

echo "✅ Déploiement terminé!"
