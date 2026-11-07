# Wave 15: Cache Performance Specifications

## 1. Overview
To ensure sub-10ms response times globally for White Caves, we utilize a robust caching tier powered by Redis. This spec defines the cache strategy for AEGIS V3.

## 2. Key Strategy
Cache keys follow a strict hierarchical taxonomy:
- **Format**: `wc:{domain}:{entity}:{id}`
- **Example**: `wc:properties:listing:9482`
- **Global Sets**: `wc:reference:locations`

## 3. Invalidation Rules
- **Write-Through**: Updates to an entity must immediately invalidate and update its specific cache key.
- **TTL Fallback**: All cached entries must have a maximum Time-To-Live (TTL) of 24 hours to prevent stale data drift in the event of an invalidation failure.
- **Pattern Invalidation**: Mass updates (e.g., bulk status changes) will use `SCAN` + `DEL` to drop wildcard keys (`wc:properties:search:*`).

## 4. Connection Pool Sizing
- Minimum pool size: 5 connections
- Maximum pool size: 50 connections
- Connection timeout: 2000ms
