SELECT setval(
    pg_get_serial_sequence('"usuario"', 'id'),
    COALESCE(MAX("id"), 1),
    MAX("id") IS NOT NULL
)
FROM "usuario";
