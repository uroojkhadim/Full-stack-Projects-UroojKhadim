<?php
// backend/cache.php - High-Performance Redis Cache Manager with SQLite Fallback
// Supports Cache-Aside architecture, automatic invalidation, and zero external dependency fallback.

class CacheManager {
    private static $instance = null;
    private $redis = null;
    private $hasRedis = false;
    private $pdo = null;
    private $prefix = '6star_cache:';

    private function __construct() {
        global $pdo;
        $this->pdo = $pdo;

        // Attempt Redis connection if extension is available
        if (extension_loaded('redis') && class_exists('Redis')) {
            try {
                $redisHost = getenv('REDIS_HOST') ?: '127.0.0.1';
                $redisPort = (int)(getenv('REDIS_PORT') ?: 6379);
                $redisAuth = getenv('REDIS_PASSWORD') ?: null;

                $r = new Redis();
                $connected = @$r->connect($redisHost, $redisPort, 0.5); // 500ms timeout
                if ($connected) {
                    if ($redisAuth) {
                        $r->auth($redisAuth);
                    }
                    $this->redis = $r;
                    $this->hasRedis = true;
                }
            } catch (Throwable $e) {
                $this->redis = null;
                $this->hasRedis = false;
            }
        }
    }

    public static function getInstance(): CacheManager {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function get($key) {
        $prefixedKey = $this->prefix . $key;

        // 1. Try Redis first
        if ($this->hasRedis) {
            try {
                $val = $this->redis->get($prefixedKey);
                if ($val !== false && $val !== null) {
                    return json_decode($val, true);
                }
            } catch (Throwable $e) {
                // Fail silently to SQLite fallback
            }
        }

        // 2. Fallback to SQLite cache_store
        if ($this->pdo) {
            try {
                $stmt = $this->pdo->prepare("SELECT value, expires_at FROM cache_store WHERE key = ? LIMIT 1");
                $stmt->execute([$key]);
                $row = $stmt->fetch();
                if ($row) {
                    if ($row['expires_at'] === null || $row['expires_at'] > time()) {
                        return json_decode($row['value'], true);
                    } else {
                        // Expired item, cleanup asynchronously or delete
                        $this->delete($key);
                    }
                }
            } catch (Throwable $e) {
                // Table might not exist yet or connection error
            }
        }

        return null;
    }

    public function set($key, $value, $ttl = 3600): bool {
        $prefixedKey = $this->prefix . $key;
        $encoded = json_encode($value);
        $success = false;

        // 1. Store in Redis if available
        if ($this->hasRedis) {
            try {
                $this->redis->setex($prefixedKey, $ttl, $encoded);
                $success = true;
            } catch (Throwable $e) {
                // Continue to SQLite
            }
        }

        // 2. Always persist in SQLite cache_store as backing store
        if ($this->pdo) {
            try {
                $expiresAt = time() + (int)$ttl;
                $stmt = $this->pdo->prepare("
                    INSERT INTO cache_store (key, value, expires_at)
                    VALUES (?, ?, ?)
                    ON CONFLICT(key) DO UPDATE SET
                        value = excluded.value,
                        expires_at = excluded.expires_at
                ");
                $stmt->execute([$key, $encoded, $expiresAt]);
                $success = true;
            } catch (Throwable $e) {
                // Fail gracefully
            }
        }

        return $success;
    }

    public function delete($key): bool {
        $prefixedKey = $this->prefix . $key;

        if ($this->hasRedis) {
            try {
                $this->redis->del($prefixedKey);
            } catch (Throwable $e) {}
        }

        if ($this->pdo) {
            try {
                $stmt = $this->pdo->prepare("DELETE FROM cache_store WHERE key = ?");
                $stmt->execute([$key]);
            } catch (Throwable $e) {}
        }

        return true;
    }

    public function flush($pattern = ''): bool {
        if ($this->hasRedis) {
            try {
                if (empty($pattern)) {
                    $keys = $this->redis->keys($this->prefix . '*');
                } else {
                    $keys = $this->redis->keys($this->prefix . $pattern . '*');
                }
                if (!empty($keys)) {
                    $this->redis->del($keys);
                }
            } catch (Throwable $e) {}
        }

        if ($this->pdo) {
            try {
                if (empty($pattern)) {
                    $this->pdo->exec("DELETE FROM cache_store");
                } else {
                    $stmt = $this->pdo->prepare("DELETE FROM cache_store WHERE key LIKE ?");
                    $stmt->execute([$pattern . '%']);
                }
            } catch (Throwable $e) {}
        }

        return true;
    }

    public function pruneExpired(): int {
        if ($this->pdo) {
            try {
                $stmt = $this->pdo->prepare("DELETE FROM cache_store WHERE expires_at IS NOT NULL AND expires_at < ?");
                $stmt->execute([time()]);
                return $stmt->rowCount();
            } catch (Throwable $e) {}
        }
        return 0;
    }

    public function isRedisActive(): bool {
        return $this->hasRedis;
    }
}

// Global Helper Functions
function cache_get($key) {
    return CacheManager::getInstance()->get($key);
}

function cache_set($key, $value, $ttl = 3600) {
    return CacheManager::getInstance()->set($key, $value, $ttl);
}

function cache_delete($key) {
    return CacheManager::getInstance()->delete($key);
}

function cache_flush($pattern = '') {
    return CacheManager::getInstance()->flush($pattern);
}

function cache_remember($key, $ttl, callable $callback) {
    $val = cache_get($key);
    if ($val !== null) {
        return $val;
    }
    $fresh = $callback();
    cache_set($key, $fresh, $ttl);
    return $fresh;
}
