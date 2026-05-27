# src/api Guide

This directory contains API boundary modules. It is not a place for React page UI.

## Responsibilities

- Isolate external IO, raw payloads, and controller contracts from views.
- Keep API modules replaceable when Supabase is replaced by an HTTP server.

## Rules

- Views should import query hooks or controller providers, not service internals.
- Raw database table names and row shapes must stay inside gateway/mapper code.
- Domain models exposed to the rest of the app should use app-level camelCase naming.

