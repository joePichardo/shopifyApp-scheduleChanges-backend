CREATE TABLE themeStatus(
    id              SERIAL PRIMARY KEY,
    name            TEXT NOT NULL
);

INSERT INTO themeStatus (name) VALUES ('production'), ('staging');
