#!/usr/bin/env bash
# ============================================================
# noalphjs Orchestrator — tools/orchestrator/orchestrator.sh
# Maintainer CLI untuk proyek noalphjs
# ============================================================

set -euo pipefail

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

log() { echo -e "${BLUE}[noalph]${NC} $1"; }
ok() { echo -e "${GREEN}✓${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC} $1"; }
err() { echo -e "${RED}✗${NC} $1"; exit 1; }

check_tool() {
  command -v "$1" &>/dev/null || err "Tool tidak ditemukan: $1 — install dulu sebelum lanjut"
}

cmd_doctor() {
  log "Memeriksa dependency tools..."
  check_tool git && ok "git"
  check_tool node && ok "node ($(node --version))"
  check_tool pnpm && ok "pnpm ($(pnpm --version))"
  check_tool turbo && ok "turbo" || warn "turbo belum terinstall global — jalankan: npm install -g turbo"
  check_tool gh && ok "gh (GitHub CLI)" || warn "gh belum terinstall — https://cli.github.com"
  node --version | grep -qE 'v(2[0-9]|[3-9][0-9])' && ok "Node.js >= 20" || warn "Disarankan Node.js >= 20"
  log "Doctor selesai."
}

cmd_setup() {
  log "Menjalankan setup awal proyek..."
  cd "$REPO_ROOT"
  pnpm install
  ok "pnpm install selesai"
  pnpm turbo run build --filter=./packages/*
  ok "Build packages selesai"
  log "Setup selesai! Jalankan: pnpm dev"
}

cmd_bootstrap() {
  log "Bootstrap monorepo..."
  cd "$REPO_ROOT"
  pnpm install --frozen-lockfile
  pnpm turbo run build --filter=./packages/*
  ok "Bootstrap selesai"
}

cmd_test_all() {
  log "Menjalankan semua tests..."
  cd "$REPO_ROOT"
  pnpm turbo run test
  ok "Semua tests selesai"
}

cmd_build_all() {
  log "Build semua packages..."
  cd "$REPO_ROOT"
  pnpm turbo run build
  ok "Build selesai"
}

cmd_release_prepare() {
  log "Menyiapkan release..."
  check_tool gh
  cd "$REPO_ROOT"
  pnpm turbo run build --filter=./packages/*
  pnpm turbo run test
  pnpm audit --audit-level=high
  log "Buat changeset baru:"
  pnpm changeset
  ok "Release preparation selesai. Commit changeset lalu push ke main."
}

cmd_labels_sync() {
  log "Sinkronisasi labels GitHub..."
  check_tool gh
  LABELS=(
    "bug:d73a4a:Bug report yang sudah diverifikasi"
    "enhancement:a2eeef:Permintaan fitur baru"
    "documentation:0075ca:Perbaikan dokumentasi"
    "good first issue:7057ff:Cocok untuk kontributor pertama kali"
    "help wanted:008672:Butuh bantuan komunitas"
    "security:ee0701:Isu terkait keamanan"
    "dependencies:0366d6:Update dependency"
    "breaking change:b60205:Perubahan yang tidak backward-compatible"
    "performance:f9d0c4:Optimasi performa"
    "compiler:1d76db:Terkait noalph-compiler"
    "parser:1d76db:Terkait noalph-parser"
    "renderer:1d76db:Terkait noalph-renderer-dom"
    "cli:1d76db:Terkait noalph-cli atau create-noalph-app"
    "vite-plugin:1d76db:Terkait noalph-vite-plugin"
    "wontfix:ffffff:Tidak akan diperbaiki"
    "duplicate:cfd3d7:Duplikat dari issue lain"
    "invalid:e4e669:Issue tidak valid"
  )
  for label in "${LABELS[@]}"; do
    IFS=':' read -r name color description <<< "$label"
    gh label create "$name" --color "$color" --description "$description" --force 2>/dev/null && ok "Label: $name" || warn "Gagal buat label: $name"
  done
}

cmd_github_publish() {
  log "Publishing ke npm..."
  check_tool gh
  cd "$REPO_ROOT"
  pnpm turbo run build --filter=./packages/*
  NPM_TOKEN="${NPM_TOKEN:-}"
  if [ -z "$NPM_TOKEN" ]; then
    err "NPM_TOKEN tidak ditemukan. Set via: export NPM_TOKEN=xxx"
  fi
  NODE_AUTH_TOKEN="$NPM_TOKEN" pnpm changeset publish
  ok "Publish selesai!"
}

cmd_issue_triage() {
  log "Membuka daftar issue untuk triage..."
  check_tool gh
  gh issue list --label "" --state open --limit 30
}

COMMAND="${1:-help}"

case "$COMMAND" in
  doctor) cmd_doctor ;;
  setup) cmd_setup ;;
  bootstrap) cmd_bootstrap ;;
  test:all) cmd_test_all ;;
  build:all) cmd_build_all ;;
  release:prepare) cmd_release_prepare ;;
  labels:sync) cmd_labels_sync ;;
  github:publish) cmd_github_publish ;;
  issue:triage) cmd_issue_triage ;;
  help|*)
    echo ""
    echo "  noalphjs Orchestrator"
    echo ""
    echo "  Usage: bash tools/orchestrator/orchestrator.sh <command>"
    echo ""
    echo "  Commands:"
    echo "    doctor            Periksa semua dependency tools"
    echo "    setup             Install + build semua packages"
    echo "    bootstrap         pnpm install + build packages"
    echo "    test:all          Jalankan semua test suites"
    echo "    build:all         Build semua packages dan apps"
    echo "    release:prepare   Audit + changeset + siap release"
    echo "    labels:sync       Sinkronisasi labels GitHub"
    echo "    github:publish    Publish semua packages ke npm"
    echo "    issue:triage      Tampilkan daftar issue terbuka"
    echo ""
    ;;
esac
