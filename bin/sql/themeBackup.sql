CREATE TABLE themeBackup(
    id              SERIAL PRIMARY KEY,
    "createdAt"       TIMESTAMP NOT NULL,
    "settingsData"  LONGTEXT NOT NULL,
    "ownerId"       INTEGER,
    "createdByScheduleId" INTEGER,
    FOREIGN KEY ("ownerId") REFERENCES account(id),
    FOREIGN KEY ("createdByScheduleId") REFERENCES themeSchedule(id)
);