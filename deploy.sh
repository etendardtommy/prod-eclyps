#!/bin/bash
set -e

echo "Mise à jour Eclyps Front..."
git pull origin main

echo "Installation des dépendances..."
npm ci

echo "Build..."
npm run build

echo "Déploiement terminé ✓"
