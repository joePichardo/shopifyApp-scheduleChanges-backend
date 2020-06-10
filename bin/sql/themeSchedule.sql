CREATE TABLE themeSchedule(
    id              SERIAL PRIMARY KEY,
    "scheduleAt"    TIMESTAMP NOT NULL,
    "settingsData"  LONGTEXT NOT NULL,
    "ownerId"       INTEGER,
    FOREIGN KEY ("ownerId") REFERENCES account(id)
);