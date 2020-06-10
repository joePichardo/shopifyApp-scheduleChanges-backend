#!/bin/bash

export PGPASSWORD='node_password'

echo "Configuring scheduled_changes_db"

dropdb -U node_user scheduled_changes_db
createdb -U node_user scheduled_changes_db

psql -U node_user scheduled_changes_db < ./bin/sql/account.sql
#psql -U node_user scheduled_changes_db < ./bin/sql/game.sql
#psql -U node_user scheduled_changes_db < ./bin/sql/gameValue.sql
#psql -U node_user scheduled_changes_db < ./bin/sql/gameMember.sql
#psql -U node_user scheduled_changes_db < ./bin/sql/gameMemberData.sql

echo "scheduled_changes_db configured"


